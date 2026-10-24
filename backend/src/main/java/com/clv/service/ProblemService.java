package com.clv.service;

import com.clv.model.Problem;
import com.clv.repository.ProblemRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;

    @PostConstruct
    public void seedInitialProblems() {
        if (problemRepository.count() == 0) {
            log.info("Seeding initial logic problems into MongoDB...");
            Problem p1 = Problem.builder()
                    .number(101)
                    .title("Sum of Two Integers Logic")
                    .slug("sum-of-two-integers")
                    .difficulty("Easy")
                    .category("Basic Math & Variables")
                    .tags(List.of("Variables", "Arithmetic", "Basic Logic"))
                    .acceptanceRate("94.2%")
                    .points(50)
                    .description("Given two integers A and B, write a step-by-step logical sequence to calculate their sum and output the resulting value.")
                    .inputFormat("Two integers A and B separated by space.")
                    .outputFormat("Single integer representing the sum A + B.")
                    .constraints("-10^9 <= A, B <= 10^9")
                    .sampleCases(List.of(new Problem.SampleCase("A = 5, B = 7", "12")))
                    .hints(List.of("Declare two variables to store inputs A and B.", "Create a third variable to store the result."))
                    .expectedKeywords(List.of("declare", "variable", "sum", "add", "store", "output"))
                    .build();

            Problem p2 = Problem.builder()
                    .number(102)
                    .title("Check Even or Odd Logic")
                    .slug("check-even-or-odd")
                    .difficulty("Easy")
                    .category("Conditional Control")
                    .tags(List.of("Conditionals", "Modulo", "Branching"))
                    .acceptanceRate("91.8%")
                    .points(50)
                    .description("Write a logical process to determine whether a given integer N is Even or Odd.")
                    .inputFormat("Single integer N.")
                    .outputFormat("String: 'Even' or 'Odd'.")
                    .constraints("-10^9 <= N <= 10^9")
                    .sampleCases(List.of(new Problem.SampleCase("N = 4", "Even")))
                    .hints(List.of("Check if remainder of N divided by 2 is 0.", "If true print 'Even', else print 'Odd'."))
                    .expectedKeywords(List.of("remainder", "modulo", "if", "else", "even", "odd"))
                    .build();

            problemRepository.saveAll(List.of(p1, p2));
            log.info("MongoDB seed completed successfully!");
        }
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Problem getProblemById(String id) {
        return problemRepository.findById(id)
                .orElseGet(() -> problemRepository.findAll().stream().findFirst().orElse(null));
    }
}
