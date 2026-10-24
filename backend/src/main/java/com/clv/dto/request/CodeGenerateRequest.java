package com.clv.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CodeGenerateRequest {

    @NotBlank(message = "Problem ID is required")
    private String problemId;

    @NotBlank(message = "Logic text is required")
    private String logicText;

    @NotBlank(message = "Target language is required")
    private String language;
}
