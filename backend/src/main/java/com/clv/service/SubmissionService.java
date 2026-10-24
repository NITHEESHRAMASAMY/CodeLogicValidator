package com.clv.service;

import com.clv.model.Submission;
import com.clv.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    public List<Submission> getUserSubmissions(String userId) {
        return submissionRepository.findByUserId(userId);
    }

    public Submission getSubmissionById(String id) {
        return submissionRepository.findById(id).orElse(null);
    }
}
