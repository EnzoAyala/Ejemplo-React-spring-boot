package com.aprender.backend.controller;

import com.aprender.backend.model.ERole;
import com.aprender.backend.model.Role;
import com.aprender.backend.model.User;
import com.aprender.backend.payload.request.RoleUpdateRequest;
import com.aprender.backend.payload.response.MessageResponse;
import com.aprender.backend.payload.response.UserResponse; // <-- Usar el nuevo DTO
import com.aprender.backend.repository.RoleRepository;
import com.aprender.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid; // Asegúrate de tener esta importación
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin") // Todas las peticiones a este controlador usarán /api/admin
@PreAuthorize("hasRole('ADMIN')") // Todas las peticiones a este controlador requieren ROLE_ADMIN
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    // Endpoint para obtener todos los usuarios (para que el admin pueda verlos)
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getName(),
                        user.getLastname(),
                        user.getDni(),
                        user.getPhone(),
                        user.getRoles().stream()
                                .map(role -> role.getName().name()) // Convierte ERole a String (ej. "ROLE_USER")
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Endpoint para actualizar los roles de un usuario
    @PutMapping("/users/roles") // URL para actualizar: PUT /api/admin/users/roles
    public ResponseEntity<?> updateUserRoles(@Valid @RequestBody RoleUpdateRequest roleUpdateRequest) {
        Optional<User> userOptional = userRepository.findById(roleUpdateRequest.getUserId());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        User user = userOptional.get(); // Ej: ["ROLE_ADMIN"] O ["ROLE_USER"]
        Set<String> strRoles = roleUpdateRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Roles cannot be empty!"));
        }

        strRoles.forEach(roleName -> {

            try {
                ERole eRole = ERole.valueOf(roleName); // Intenta convertir "ROLE_ADMIN" a ERole.ROLE_ADMIN

                // Busca el Role en la base de datos por el ERole
                Role foundRole = roleRepository.findByName(eRole)
                        .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " is not found."));

                roles.add(foundRole);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException ("Error: Role " + roleName + "is invalid or not permitted for assignment. ", e);
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User roles updated successfully!"));
    }
}