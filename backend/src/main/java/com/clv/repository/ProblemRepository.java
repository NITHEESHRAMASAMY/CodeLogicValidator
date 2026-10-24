package com.clv.repository;

import com.clv.model.Problem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepository extends MongoRepository<Problem, String> {
    Optional<Problem> findBySlug(String slug);
    Optional<Problem> findByNumber(Integer number);
    List<Problem> findByDifficulty(String difficulty);
}
