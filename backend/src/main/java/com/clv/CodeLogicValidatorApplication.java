package com.clv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class CodeLogicValidatorApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeLogicValidatorApplication.class, args);
    }
}
