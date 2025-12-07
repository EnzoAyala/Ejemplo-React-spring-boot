package com.aprender.backend.domain.mappers;

import com.aprender.backend.domain.dto.response.UserResponseAdmin;
import com.aprender.backend.domain.dto.response.UserResponseUser;
import com.aprender.backend.persistence.entity.Role;
import com.aprender.backend.persistence.entity.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponseUser toUserResponseUser(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseUser(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getLastname(),
                user.getPhone(),
                user.isOnline(),
                user.getLastActive(),
                user.getGender(),
                user.getProfilePictureUrl(),
                user.getDescription(),
                user.getEmail()
        );
    }

    public UserResponseAdmin toUserResponseAdmin(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseAdmin(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getLastname(),
                user.getDni(),
                user.getPhone(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toList()),
                user.isOnline(),
                user.getLastActive()
        );
    }
}
