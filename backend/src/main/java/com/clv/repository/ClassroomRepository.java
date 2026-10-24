package com.clv.repository;

import com.clv.model.Classroom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassroomRepository extends MongoRepository<Classroom, String> {
    Optional<Classroom> findByCode(String code);
    boolean existsByCode(String code);
}
