package com.clv.repository;

import com.clv.model.AuthenticationToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends MongoRepository<AuthenticationToken, String> {
    Optional<AuthenticationToken> findByTokenAndTypeAndIsUsedFalse(String token, AuthenticationToken.TokenType type);
    Optional<AuthenticationToken> findTopByUserIdAndTypeAndIsUsedFalseOrderByCreatedAtDesc(String userId, AuthenticationToken.TokenType type);
}
