package com.clv.controller;

import com.clv.dto.request.DoubtRequest;
import com.clv.dto.response.DoubtResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doubts")
@RequiredArgsConstructor
public class DoubtController {

    @PostMapping("/ask")
    public ResponseEntity<DoubtResponse> askDoubt(@Valid @RequestBody DoubtRequest request) {
        String questionLower = request.getQuestion().toLowerCase();
        String explanation = "In algorithm design, variables act as memory containers. Ensure you initialize variables before performing arithmetic operations and store calculations before printing.";

        if (questionLower.contains("loop") || questionLower.contains("while")) {
            explanation = "Loops require 3 components: 1. Counter Initialization, 2. Boundary Condition, 3. Counter Increment/State Update inside loop body.";
        }

        DoubtResponse response = DoubtResponse.builder()
                .problemId(request.getProblemId())
                .category(request.getCategory())
                .question(request.getQuestion())
                .explanation(explanation)
                .keyTakeaways(List.of("State variables explicitly", "Check loop termination conditions", "Preserve hint-only educational rules"))
                .build();

        return ResponseEntity.ok(response);
    }
}
