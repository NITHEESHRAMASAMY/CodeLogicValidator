package com.clv.service;

import com.clv.dto.response.EvaluationResponse;
import com.clv.model.Problem;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LlmEvaluationService {

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${clv.llm.gemini-api-key:}")
    private String geminiApiKey;

    @Value("${clv.llm.model:gemini-2.0-flash}")
    private String modelName;

    public boolean isLlmConfigured() {
        return geminiApiKey != null && !geminiApiKey.isBlank();
    }

    /**
     * Evaluates user logic using Google Gemini REST API.
     */
    public EvaluationResponse evaluateLogicWithLlm(Problem problem, String logicText) {
        if (!isLlmConfigured()) {
            return null;
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + geminiApiKey;

            String sampleCasesStr = "";
            if (problem != null && problem.getSampleCases() != null) {
                sampleCasesStr = problem.getSampleCases().stream()
                        .map(sc -> "Input: " + sc.getInput() + " => Expected Output: " + sc.getOutput())
                        .reduce("", (acc, item) -> acc + "\n" + item);
            }

            String systemPrompt = """
                    You are a strict, world-class Computer Science Algorithm Evaluator for Code Logic Validator (CLV).
                    Your job is to evaluate if the student's step-by-step natural language/pseudo-code logic correctly solves the specified problem.

                    PROBLEM DETAILS:
                    Title: %s
                    Description: %s
                    Input Format: %s
                    Output Format: %s
                    Constraints: %s
                    Sample Test Cases: %s

                    STUDENT SUBMITTED LOGIC:
                    \"\"\"
                    %s
                    \"\"\"

                    EVALUATION RULES:
                    1. STRICT MATHEMATICAL & ALGORITHMIC CORRECTNESS:
                       - If the problem requires addition/sum, but the student performs multiplication (*), subtraction (-), or division (/), it MUST BE A FAIL (passed = false, score <= 50).
                       - VARIABLE OUTPUT MISMATCH: Trace which variable holds the calculated result. If the student calculates result in variable C (`c = a + b`) but outputs variable A or B (`print a` or `print b`), the output value will be incorrect (e.g. 5 instead of 12). It MUST BE A FAIL (passed = false).
                       - Dry-run the student's logic step-by-step on all Sample Test Cases. If the output value does not match expected output, it MUST FAIL.
                    2. COMPLETENESS & SEQUENCING:
                       - Check if variables are declared/read, calculation is stored, and the CORRECT result variable is printed/outputted.
                    3. SCORE & STARS:
                       - If passed: score 88-100, stars 4 or 5.
                       - If failed: score 30-65, stars 1 or 2.

                    CRITICAL INSTRUCTION: You MUST return ONLY a JSON object with NO markdown formatting around it (no ```json codeblocks):
                    {
                      "passed": true|false,
                      "score": 95,
                      "stars": 5,
                      "summary": "Clear 1-sentence assessment summary.",
                      "explainWhy": {
                         "missing": "Short sentence explaining missing or wrong step.",
                         "impact": "Impact of the logical flaw.",
                         "guidance": "Concrete suggestion on how to fix."
                      },
                      "feedback": [
                         {"step": "Step 1: Input & Setup", "status": "PASS|FAIL|WARN", "detail": "Detail message"},
                         {"step": "Step 2: Core Algorithm", "status": "PASS|FAIL|WARN", "detail": "Detail message"},
                         {"step": "Step 3: Termination & Output", "status": "PASS|FAIL|WARN", "detail": "Detail message"}
                      ],
                      "hints": ["Hint 1", "Hint 2"]
                    }
                    """.formatted(
                    problem != null ? problem.getTitle() : "Algorithm Problem",
                    problem != null ? problem.getDescription() : "",
                    problem != null ? problem.getInputFormat() : "",
                    problem != null ? problem.getOutputFormat() : "",
                    problem != null ? problem.getConstraints() : "",
                    sampleCasesStr,
                    logicText
            );

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", systemPrompt)))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                if (!textNode.isMissingNode()) {
                    String rawText = textNode.asText().trim();
                    if (rawText.startsWith("```json")) rawText = rawText.substring(7);
                    if (rawText.startsWith("```")) rawText = rawText.substring(3);
                    if (rawText.endsWith("```")) rawText = rawText.substring(0, rawText.length() - 3);
                    rawText = rawText.trim();

                    JsonNode evalJson = objectMapper.readTree(rawText);
                    boolean passed = evalJson.path("passed").asBoolean(false);
                    int score = evalJson.path("score").asInt(passed ? 90 : 45);
                    int stars = evalJson.path("stars").asInt(passed ? 5 : 2);
                    String summary = evalJson.path("summary").asText(passed ? "Logic is sound." : "Logic evaluation failed.");

                    List<EvaluationResponse.StepFeedbackDto> feedbackList = new ArrayList<>();
                    JsonNode feedbackNode = evalJson.path("feedback");
                    if (feedbackNode.isArray()) {
                        for (JsonNode f : feedbackNode) {
                            feedbackList.add(new EvaluationResponse.StepFeedbackDto(
                                    f.path("step").asText("Step"),
                                    f.path("status").asText("PASS"),
                                    f.path("detail").asText("")
                            ));
                        }
                    }

                    List<String> hintsList = new ArrayList<>();
                    JsonNode hintsNode = evalJson.path("hints");
                    if (hintsNode.isArray()) {
                        for (JsonNode h : hintsNode) {
                            hintsList.add(h.asText());
                        }
                    }

                    log.info("Successfully evaluated logic via Gemini LLM. Passed: {}", passed);

                    return EvaluationResponse.builder()
                            .passed(passed)
                            .stars(stars)
                            .score(score)
                            .summary(summary)
                            .feedback(feedbackList)
                            .hints(hintsList)
                            .build();
                }
            }
        } catch (Exception e) {
            log.error("Failed to call Gemini LLM for logic evaluation: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Generates source code in requested language via Gemini LLM.
     */
    public String generateCodeWithLlm(Problem problem, String logicText, String language) {
        if (!isLlmConfigured()) return null;

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + geminiApiKey;
            String prompt = """
                    You are an expert algorithm translator for Code Logic Validator (CLV).
                    Translate the following student's verified step-by-step logic into syntactically valid, runnable %s source code.
                    
                    PROBLEM TITLE: %s
                    STUDENT VERIFIED LOGIC:
                    \"\"\"
                    %s
                    \"\"\"

                    STRICT TRANSLATION RULES:
                    1. FIDELITY TO USER LOGIC & KEYWORDS:
                       - Generate code STRICTLY based on the user's written logic, steps, and user-given variable names (e.g., if the user wrote X, Y, Z, use X, Y, Z).
                       - If the student wrote conditional reasoning (e.g., "If X is greater than both... Otherwise, if Y is greater than both... Otherwise, print Z"), write explicit `if / else if / else` branching statements.
                       - NEVER replace the student's reasoning steps with built-in shortcuts (like Math.max(), max(), etc.) unless the student explicitly used that keyword.
                    2. RUNNABILITY:
                       - Include main/solve execution with sample values initialized so the code runs directly and prints the result.
                       - Add brief comments referencing the student's steps.
                    3. Output ONLY the source code inside a markdown ``` block.
                    """.formatted(language, problem != null ? problem.getTitle() : "Algorithm", logicText);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                if (!textNode.isMissingNode()) {
                    String code = textNode.asText().trim();
                    if (code.startsWith("```" + language)) code = code.substring(3 + language.length());
                    else if (code.startsWith("```")) code = code.substring(3);
                    if (code.endsWith("```")) code = code.substring(0, code.length() - 3);
                    return code.trim();
                }
            }
        } catch (Exception e) {
            log.error("Failed to generate code via Gemini LLM: {}", e.getMessage());
        }
        return null;
    }
}
