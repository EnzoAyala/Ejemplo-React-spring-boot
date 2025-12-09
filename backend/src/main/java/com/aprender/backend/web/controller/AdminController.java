package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.request.RoleUpdateRequest;
import com.aprender.backend.domain.dto.response.MessageResponse;
import com.aprender.backend.domain.dto.response.UserResponseDTO;
import com.aprender.backend.domain.services.UserService;
import com.aprender.backend.persistence.entity.Role;
import com.aprender.backend.persistence.entity.User;
import com.aprender.backend.persistence.repository.RoleRepository;
import com.aprender.backend.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService; // Inyectamos UserService para obtener usuarios con detalles de suscripción

    /**
     * Endpoint para obtener todos los usuarios con detalles de suscripción (BASIC / PREMIUM)
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsersWithDetails();
        return ResponseEntity.ok(users);
    }

    /**
     * Endpoint para actualizar los roles de un usuario
     */
    @PutMapping("/users/roles")
    public ResponseEntity<?> updateUserRoles(@Valid @RequestBody RoleUpdateRequest roleUpdateRequest) {
        Optional<User> userOptional = userRepository.findById(roleUpdateRequest.getUserId());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: usuario no encontrado!"));
        }

        User user = userOptional.get();
        Set<String> strRoles = roleUpdateRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: roles no pueden estar vacíos!"));
        }

        strRoles.forEach(roleName -> {
            try {
                Role foundRole = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Error: El rol " + roleName + " no se encuentra."));
                roles.add(foundRole);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Error: El rol " + roleName + " es inválido o no está permitido.", e);
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Roles de usuario actualizados con éxito!"));
    }

    /**
     * Endpoint para eliminar un usuario por ID
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Usuario no encontrado!"));
        }

        userRepository.deleteById(id);

        // Emitir evento de eliminación a través de WebSocket
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "USER_DELETED");
        payload.put("id", id);
        messagingTemplate.convertAndSend("/topic/user-updates", payload);

        return ResponseEntity.ok(new MessageResponse("Usuario eliminado con éxito!"));
    }
}
