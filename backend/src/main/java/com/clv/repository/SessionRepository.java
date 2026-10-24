package com.clv.repository;

import com.clv.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends MongoRepository<Session, String> {
    Optional<Session> findByRefreshToken(String refreshToken);
    List<Session> findByUserId(String userId);
    void deleteByUserId(String userId);
}
