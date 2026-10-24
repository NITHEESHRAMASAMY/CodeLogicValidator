package com.clv.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LogicSubmissionRequest {

    @NotBlank(message = "Problem ID is required")
    private String problemId;

    @NotBlank(message = "Logic text is required")
    private String logicText;
}
