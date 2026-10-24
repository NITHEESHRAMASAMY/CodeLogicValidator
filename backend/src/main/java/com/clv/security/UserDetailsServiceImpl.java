package com.clv.security;

import com.clv.model.User;
import com.clv.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    if (com.clv.service.AdminService.ADMIN_EMAIL.equalsIgnoreCase(email)) {
                        User admin = User.builder()
                                .fullName("Nitheesh (System Admin)")
                                .email(com.clv.service.AdminService.ADMIN_EMAIL)
                                .password("$2a$10$w82fS/2kK5zY0RkM2aO3ce6O0LwJ6yW2rQGzE9bE5sR1kK4zY0RkM") // Admin@123
                                .isEmailVerified(true)
                                .provider("LOCAL")
                                .roles(new java.util.HashSet<>(java.util.Set.of("ROLE_ADMIN", "ROLE_USER")))
                                .avatarUrl(null)
                                .build();
                        return userRepository.save(admin);
                    }
                    throw new UsernameNotFoundException("User not found with email: " + email);
                });

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword() != null ? user.getPassword() : "",
                user.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
        );
    }
}
