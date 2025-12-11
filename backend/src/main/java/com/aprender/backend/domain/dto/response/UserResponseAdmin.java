package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseAdmin {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String lastname;
    private String dni;
    private String phone;
    private List<String> roles; // Representa los roles como Strings (ej. "ROLE_PLAN_GRATUITO", "ROLE_ADMIN")
    private Boolean isOnline;
    private LocalDateTime lastActive;
}
