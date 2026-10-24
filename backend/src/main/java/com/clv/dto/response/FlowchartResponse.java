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
public class FlowchartResponse {

    private String problemId;
    private List<FlowNode> nodes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlowNode {
        private String type;  // START, INPUT, PROCESS, OUTPUT, END
        private String label;
    }
}
