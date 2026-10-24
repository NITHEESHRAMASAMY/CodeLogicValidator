package com.clv.repository;

import com.clv.model.ProblemRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRequestRepository extends MongoRepository<ProblemRequest, String> {
    List<ProblemRequest> findByUserEmail(String userEmail);
    List<ProblemRequest> findAllByOrderByCreatedAtDesc();
}
