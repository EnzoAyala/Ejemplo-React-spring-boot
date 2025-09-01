package com.aprender.backend.controller;

import com.aprender.backend.model.User;
import com.aprender.backend.payload.request.ProfileUpdateRequest;
import com.aprender.backend.payload.response.MessageResponse;
import com.aprender.backend.payload.response.UserResponseUser;
import com.aprender.backend.repository.UserRepository;
import com.aprender.backend.security.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    FileStorageService fileStorageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
                        user.getLastActive(),
                        user.getGender(),
                        user.getProfilePictureUrl()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Actualización con JSON puro (sin imagen)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id,
                                               @RequestBody ProfileUpdateRequest profileUpdateRequest) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado."));

        user.setName(profileUpdateRequest.getName());
        user.setLastname(profileUpdateRequest.getLastname());
        user.setPhone(profileUpdateRequest.getPhone());

        userRepository.save(user);

        return ResponseEntity.ok("Usuario actualizado correctamente.");
    }

    // Actualización con multipart/form-data (perfil + archivo de imagen)
    @PutMapping(path = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateUserProfileWithPhoto(@PathVariable Long id,
                                                        @RequestPart("profile") ProfileUpdateRequest profileUpdateRequest,
                                                        @RequestPart(value = "file", required = false) MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado."));

        user.setName(profileUpdateRequest.getName());
        user.setLastname(profileUpdateRequest.getLastname());
        user.setPhone(profileUpdateRequest.getPhone());

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            user.setProfilePictureUrl(fileName);
        }

        userRepository.save(user);

        return ResponseEntity.ok("Usuario actualizado correctamente.");
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordRequest) {
        String currentPassword = passwordRequest.get("currentPassword");
        String newPassword = passwordRequest.get("newPassword");
        String confirmPassword = passwordRequest.get("confirmPassword");

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Las contraseñas nuevas no coinciden."));
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado."));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: La contraseña actual es incorrecta."));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Contraseña actualizada correctamente."));
    }
}
