package com.clv.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoubtResponse {

    private String problemId;
    private String category;
    private String question;
    private String explanation;
    private List<String> keyTakeaways;
}
