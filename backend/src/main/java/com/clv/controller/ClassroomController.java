package com.clv.controller;

import com.clv.dto.response.ApiResponse;
import com.clv.model.Classroom;
import com.clv.repository.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/classroom")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomRepository classroomRepository;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createClassroom(
            Authentication authentication,
            @RequestParam String name) {
        String teacherEmail = (authentication != null) ? authentication.getName() : "teacher@clv.io";
        String code = "CLV-" + (100000 + new Random().nextInt(900000));

        Classroom classroom = Classroom.builder()
                .name(name)
                .code(code)
                .teacherEmail(teacherEmail)
                .teacherName("Teacher Admin")
                .capacity(60)
                .members(new ArrayList<>())
                .build();

        classroom.getMembers().add(Classroom.Member.builder()
                .userId(teacherEmail)
                .name("Teacher Admin")
                .role("TEACHER")
                .points(500)
                .accuracy(100.0)
                .status("ONLINE")
                .build());

        Classroom saved = classroomRepository.save(classroom);
        return ResponseEntity.ok(ApiResponse.ok("Classroom created successfully", saved));
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse> joinClassroom(
            Authentication authentication,
            @RequestParam String code) {
        Optional<Classroom> roomOpt = classroomRepository.findByCode(code.toUpperCase());
        if (roomOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid room code"));
        }

        Classroom classroom = roomOpt.get();
        if (classroom.getMembers().size() >= 60) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Classroom room is full! Capacity is strictly capped at 60 members."));
        }

        String userEmail = (authentication != null) ? authentication.getName() : "student@clv.io";
        boolean alreadyMember = classroom.getMembers().stream().anyMatch(m -> m.getUserId().equals(userEmail));

        if (!alreadyMember) {
            classroom.getMembers().add(Classroom.Member.builder()
                    .userId(userEmail)
                    .name("Student Participant")
                    .role("STUDENT")
                    .points(0)
                    .accuracy(0.0)
                    .status("ONLINE")
                    .build());
            classroomRepository.save(classroom);
        }

        return ResponseEntity.ok(ApiResponse.ok("Successfully joined classroom", classroom));
    }
}
