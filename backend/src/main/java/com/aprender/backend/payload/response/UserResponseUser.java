package com.aprender.backend.payload.response;

import com.aprender.backend.model.EGender;
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
    private EGender gender;
    private String profilePictureUrl;

}
