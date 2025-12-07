package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseUser {

    private Long id;
    private String username;
    private String name;
    private String lastname;
    private String phone;
    private Boolean isOnline;
    private LocalDateTime lastActive;
    private String gender;
    private String profilePictureUrl;
    private String description;
    private String email;
}
