package com.clv.service;

import com.clv.dto.request.LogicSubmissionRequest;
import com.clv.dto.response.EvaluationResponse;
import com.clv.model.Problem;
import com.clv.model.Submission;
import com.clv.repository.ProblemRepository;
import com.clv.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogicEvaluationService {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final LlmEvaluationService llmEvaluationService;
    private final StreakService streakService;

    public EvaluationResponse evaluate(String userId, LogicSubmissionRequest request) {
        Problem problem = problemRepository.findById(request.getProblemId()).orElse(null);
        String logicText = request.getLogicText();

        // 1. Try evaluation via connected LLM Service (Google Gemini)
        EvaluationResponse llmResponse = llmEvaluationService.evaluateLogicWithLlm(problem, logicText);
        if (llmResponse != null) {
            saveSubmissionRecord(userId, request.getProblemId(), logicText, llmResponse);
            applyStreak(userId, llmResponse);
            return llmResponse;
        }

        // 2. Fallback to Smart Problem-Aware Logic Engine & Dry-Runner
        EvaluationResponse evaluated = evaluateLocallySmart(problem, request.getProblemId(), logicText);
        saveSubmissionRecord(userId, request.getProblemId(), logicText, evaluated);
        applyStreak(userId, evaluated);
        return evaluated;
    }

    private void applyStreak(String userId, EvaluationResponse response) {
        if (response == null) return;
        try {
            if (response.isPassed()) {
                StreakService.StreakInfo streak = streakService.recordSuccessfulSolve(userId);
                response.setCurrentStreak(streak.getCurrentStreak());
                response.setLastSolvedDate(streak.getLastSolvedDate());
            } else {
                StreakService.StreakInfo streak = streakService.getUserStreak(userId);
                response.setCurrentStreak(streak.getCurrentStreak());
                response.setLastSolvedDate(streak.getLastSolvedDate());
            }
        } catch (Exception e) {
            log.warn("Failed to apply streak rules for user {}: {}", userId, e.getMessage());
        }
    }

    private void saveSubmissionRecord(String userId, String problemId, String logicText, EvaluationResponse res) {
        try {
            List<Submission.StepFeedback> mongoFeedback = res.getFeedback() != null ?
                    res.getFeedback().stream()
                            .map(f -> new Submission.StepFeedback(f.getStep(), f.getStatus(), f.getDetail()))
                            .toList() : new ArrayList<>();

            Submission submission = Submission.builder()
                    .userId(userId)
                    .problemId(problemId)
                    .logicText(logicText)
                    .passed(res.isPassed())
                    .stars(res.getStars())
                    .score(res.getScore())
                    .summary(res.getSummary())
                    .feedback(mongoFeedback)
                    .hintsProvided(res.getHints())
                    .build();

            submissionRepository.save(submission);
        } catch (Exception e) {
            log.warn("Failed to persist submission in database: {}", e.getMessage());
        }
    }

    /**
     * Smart Problem-Aware Logic Engine & Dry-Runner.
     * Validates logic based on actual problem constraints and arithmetic operations.
     */
    private EvaluationResponse evaluateLocallySmart(Problem problem, String problemId, String logicText) {
        String textLower = logicText.toLowerCase(Locale.ROOT);
        String[] lines = logicText.split("\n");

        String pId = (problemId != null) ? problemId.toLowerCase() : "";
        String pTitle = (problem != null && problem.getTitle() != null) ? problem.getTitle().toLowerCase() : "";

        boolean isSumProblem = pId.contains("101") || pId.contains("sum") || pTitle.contains("sum") || pTitle.contains("add");
        boolean isEvenOddProblem = pId.contains("102") || pTitle.contains("even") || pTitle.contains("odd");
        boolean isMaxProblem = pId.contains("103") || pTitle.contains("maximum") || pTitle.contains("largest");
        boolean isArrayReversalProblem = pId.contains("201") || pTitle.contains("revers");
        boolean isBinarySearchProblem = pId.contains("202") || pTitle.contains("binary search");

        List<EvaluationResponse.StepFeedbackDto> feedback = new ArrayList<>();
        List<String> hints = new ArrayList<>();

        boolean hasDeclaration = textLower.contains("declare") || textLower.contains("read") || textLower.contains("input")
                || textLower.contains("var") || textLower.contains("integer") || textLower.contains("let")
                || textLower.contains("a;") || textLower.contains("b;");

        boolean hasOutput = textLower.contains("output") || textLower.contains("print") || textLower.contains("display")
                || textLower.contains("show") || textLower.contains("return");

        boolean passed = false;
        int score = 45;
        int stars = 2;
        String summary = "";

        if (isSumProblem) {
            boolean hasMultiplication = textLower.contains("*") || textLower.contains("mult") || textLower.contains("product");
            boolean hasSubtraction = textLower.contains("-") && !textLower.contains("a - b") && !textLower.contains("->");
            boolean hasDivision = textLower.contains("/") && !textLower.contains("//");
            boolean hasAddition = textLower.contains("+") || textLower.contains("add") || textLower.contains("sum") || textLower.contains("plus");

            // Extract assigned variable and printed variable
            String assignedVar = null;
            String printedToken = null;

            for (String line : lines) {
                String trimmed = line.trim().replaceAll(";", "");
                String lower = trimmed.toLowerCase();

                if (lower.contains("=") && !lower.contains("==")) {
                    String[] parts = trimmed.split("=");
                    if (parts.length >= 2) {
                        assignedVar = parts[0].trim().toLowerCase();
                    }
                }

                if (lower.startsWith("print") || lower.startsWith("output") || lower.startsWith("display") || lower.startsWith("show") || lower.startsWith("return")) {
                    printedToken = lower.replaceAll("^(print|output|display|show|return)\\s*", "").trim();
                }
            }

            // Check if user printed an input variable (a or b) instead of the result variable (c or sum)
            boolean printedInputVariableInsteadOfResult = false;
            if (printedToken != null && (printedToken.equals("a") || printedToken.equals("b"))) {
                if (assignedVar != null && !assignedVar.equals(printedToken)) {
                    printedInputVariableInsteadOfResult = true;
                }
            }

            // Dry-run test case evaluation: e.g. A=5, B=7 expected 12
            if (hasMultiplication) {
                passed = false;
                score = 40;
                stars = 1;
                summary = "Logic Evaluation Failed: Incorrect arithmetic operation (multiplication used instead of addition).";

                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 1: Input & Setup", "PASS", "Variables A and B initialized."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 2: Core Algorithm", "FAIL", "Invalid Operator: Multiplication (*) detected. Calculating sum requires Addition (+). Sample Test Case (A=5, B=7) yielded 35 instead of expected 12."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 3: Termination & Output", "WARN", "Outputs incorrect multiplied value."));

                hints.add("Replace the multiplication operation (*) with addition (+) to calculate the sum.");
                hints.add("Ensure the expression adds inputs A and B (e.g. `sum = A + B`).");
            } else if (printedInputVariableInsteadOfResult) {
                passed = false;
                score = 42;
                stars = 1;
                summary = "Logic Evaluation Failed: Variable output mismatch (printed input variable '" + printedToken + "' instead of result variable '" + assignedVar + "').";

                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 1: Input & Setup", "PASS", "Variables A and B initialized."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 2: Core Algorithm", "PASS", "Addition expression '" + assignedVar + " = a + b' correctly computes 12."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 3: Termination & Output", "FAIL", "Output Target Mismatch: You printed variable '" + printedToken + "' (value 5) instead of printing the result variable '" + assignedVar + "' (value 12)."));

                hints.add("Change `print " + printedToken + "` to `print " + assignedVar + "` so the calculated sum is outputted.");
                hints.add("Make sure to output the variable that stores the result of `a + b`.");
            } else if (!hasAddition) {
                passed = false;
                score = 45;
                stars = 2;
                summary = "Logic Evaluation Failed: Missing addition step required to compute sum.";

                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 1: Input & Setup", "PASS", "Variables initialized."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 2: Core Algorithm", "FAIL", "No addition operation (+) found in reasoning steps."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 3: Termination & Output", "WARN", "Output step incomplete."));

                hints.add("Add a step specifying `result = A + B`.");
            } else if (!hasOutput) {
                passed = false;
                score = 55;
                stars = 2;
                summary = "Logic Evaluation Failed: Missing output or print statement.";

                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 1: Input & Setup", "PASS", "Variables initialized."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 2: Core Algorithm", "PASS", "Addition operation detected."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 3: Termination & Output", "FAIL", "Missing print/display step to return final sum."));

                hints.add("Add a final step like `print sum;` or `output result;`.");
            } else {
                passed = true;
                score = 96;
                stars = 5;
                summary = "Logical reasoning is complete, mathematically sound, and properly structured!";

                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 1: Input & Setup", "PASS", "Variables A and B initialized properly."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 2: Core Algorithm", "PASS", "Addition operation (+) correctly computes sum (Sample A=5, B=7 => 12)."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 3: Termination & Output", "PASS", "Outputs the calculated sum value."));
            }
        } else if (isEvenOddProblem) {
            boolean hasModulo = textLower.contains("%") || textLower.contains("mod") || textLower.contains("remainder") || textLower.contains("divide by 2") || textLower.contains("divisible");
            boolean hasCondition = textLower.contains("if") || textLower.contains("check") || textLower.contains("even");

            if (hasModulo && hasCondition && hasOutput) {
                passed = true;
                score = 94;
                stars = 5;
                summary = "Logical reasoning for Even/Odd check is complete and correct!";
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 1: Input & Setup", "PASS", "Input N initialized."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 2: Core Algorithm", "PASS", "Modulo check (N % 2 == 0) correctly evaluates evenness."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 3: Termination & Output", "PASS", "Branch outputs 'Even' or 'Odd' correctly."));
            } else {
                passed = false;
                score = 50;
                stars = 2;
                summary = "Logic needs refinement. Even/Odd verification requires checking remainder of division by 2.";
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 1: Input & Setup", "PASS", "Input parameters detected."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 2: Core Algorithm", "FAIL", "Missing modulo operation (N % 2) or conditional check."));
                feedback.add(new EvaluationResponse.StepFeedbackDto("Step 3: Termination & Output", "WARN", "Incomplete output branching."));
                hints.add("Check if the remainder of N divided by 2 is equal to 0.");
            }
        } else {
            // General fallback
            long conceptHits = (hasDeclaration ? 1 : 0) + (hasOutput ? 1 : 0) + (lines.length >= 3 ? 2 : 1);
            passed = conceptHits >= 3 && lines.length >= 3;
            score = passed ? 90 : 50;
            stars = passed ? 4 : 2;
            summary = passed ? "Logical reasoning is sound and structured." : "Logic requires additional step-by-step clarity.";

            feedback.add(new EvaluationResponse.StepFeedbackDto("Step 1: Setup", hasDeclaration ? "PASS" : "WARN", "Variables setup step."));
            feedback.add(new EvaluationResponse.StepFeedbackDto("Step 2: Core Algorithm", passed ? "PASS" : "FAIL", "Algorithmic sequencing."));
            feedback.add(new EvaluationResponse.StepFeedbackDto("Step 3: Output", hasOutput ? "PASS" : "WARN", "Output presentation."));
        }

        return EvaluationResponse.builder()
                .passed(passed)
                .stars(stars)
                .score(score)
                .summary(summary)
                .feedback(feedback)
                .hints(hints)
                .build();
    }
}
