package com.clv.controller;

import com.clv.dto.request.CodeGenerateRequest;
import com.clv.dto.request.LogicSubmissionRequest;
import com.clv.dto.response.CodeGenerateResponse;
import com.clv.dto.response.EvaluationResponse;
import com.clv.dto.response.FlowchartResponse;
import com.clv.service.CodeGenerationService;
import com.clv.service.LogicEvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/logic")
@RequiredArgsConstructor
public class LogicController {

    private final LogicEvaluationService evaluationService;
    private final CodeGenerationService generationService;

    @PostMapping("/evaluate")
    public ResponseEntity<EvaluationResponse> evaluateLogic(
            Authentication authentication,
            @Valid @RequestBody LogicSubmissionRequest request) {
        String userId = (authentication != null) ? authentication.getName() : "anonymous_user";
        EvaluationResponse response = evaluationService.evaluate(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/flowchart")
    public ResponseEntity<FlowchartResponse> generateFlowchart(
            @Valid @RequestBody LogicSubmissionRequest request) {
        String[] lines = request.getLogicText().split("\n");
        List<FlowchartResponse.FlowNode> nodes = new ArrayList<>();
        nodes.add(FlowchartResponse.FlowNode.builder().type("START").label("Start").build());

        for (String line : lines) {
            String trimmed = line.trim().replaceAll("^[0-9]+\\.\\s*", "");
            if (trimmed.isEmpty()) continue;
            String lower = trimmed.toLowerCase();
            String type = "PROCESS";
            if (lower.contains("declare") || lower.contains("read") || lower.contains("input") || lower.contains("let")) {
                type = "INPUT";
            } else if (lower.contains("print") || lower.contains("output") || lower.contains("return") || lower.contains("display")) {
                type = "OUTPUT";
            }
            String formattedLabel = Character.toUpperCase(trimmed.charAt(0)) + trimmed.substring(1);
            nodes.add(FlowchartResponse.FlowNode.builder().type(type).label(formattedLabel).build());
        }

        nodes.add(FlowchartResponse.FlowNode.builder().type("END").label("End").build());

        FlowchartResponse response = FlowchartResponse.builder()
                .problemId(request.getProblemId())
                .nodes(nodes)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate-code")
    public ResponseEntity<CodeGenerateResponse> generateCode(
            @Valid @RequestBody CodeGenerateRequest request) {
        CodeGenerateResponse response = generationService.generateCode(request);
        return ResponseEntity.ok(response);
    }
}
