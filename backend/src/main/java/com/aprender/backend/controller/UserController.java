package com.aprender.backend.controller;

import com.aprender.backend.payload.response.UserResponseUser;
import com.aprender.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class UserController {
    
    @Autowired
    UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<UserResponseUser> users = userRepository.findAll().stream()
                .map(user -> new UserResponseUser(
                        user.getId(),
                        user.getUsername(),
                        user.getName(),
                        user.getLastname(),
                        user.getPhone(),
                        user.isOnline(), 
                        user.getLastActive()
                        ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

}
