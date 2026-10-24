package com.clv.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoubtRequest {

    private String problemId;

    private String category;

    @NotBlank(message = "Question text cannot be blank")
    private String question;
}
