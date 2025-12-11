package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.request.RoleUpdateRequest;
import com.aprender.backend.domain.dto.response.MessageResponse;
import com.aprender.backend.domain.dto.response.UserResponseAdmin;
import com.aprender.backend.domain.repository.RoleRepository;
import com.aprender.backend.domain.repository.UserRepository;
import com.aprender.backend.persistence.entity.Role;
import com.aprender.backend.persistence.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid; 
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/admin") // Todas las peticiones a este controlador usarán /api/admin
@PreAuthorize("hasAnyRole('ADMIN')") // Todas las peticiones a este controlador requieren ROLE_ADMIN
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    // Endpoint para obtener todos los usuarios (para que el admin pueda verlos)
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<UserResponseAdmin> users = userRepository.findAll().stream()
                .map(user -> new UserResponseAdmin(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getName(),
                        user.getLastname(),
                        user.getDni(),
                        user.getPhone(),
                        user.getRoles().stream()
                                .map(role -> role.getName()) // Convierte el rol a String (ej. "ROLE_PLAN_GRATUITO")
                                .collect(Collectors.toList()),
                        user.isOnline(), 
                        user.getLastActive()
                        ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Endpoint para actualizar los roles de un usuario
    @PutMapping("/users/roles") // URL para actualizar: PUT /api/admin/users/roles
    public ResponseEntity<?> updateUserRoles(@Valid @RequestBody RoleUpdateRequest roleUpdateRequest) {
        Optional<User> userOptional = userRepository.findById(roleUpdateRequest.getUserId());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: usuario no encontrado!"));
        }

        User user = userOptional.get(); // Ej: ["ROLE_ADMIN"] O ["ROLE_USER"]
        Set<String> strRoles = roleUpdateRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: roles no pueden estar vacíos!"));
        }

        strRoles.forEach(roleName -> {

            try {
                // Busca el Rol en la base de datos
                Role foundRole = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Error: El rol " + roleName + " no se encuentra."));
                roles.add(foundRole);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException ("Error: El rol " + roleName + " es invalido o no esta permitido para la asignacion. ", e);
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Roles de usuario actualizados con éxito!"));
    }

    // Nuevo EndPoint para eliminar un usuario por ID
    @DeleteMapping("/users/{id}") // URL para eliminar: /api/admin/users/{id}
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        Optional<User> userOptional = userRepository.findById(id);

        if(userOptional.isEmpty()){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Usuario no encontrado!"));
        }

        userRepository.deleteById(id);

        // Emitir evento de eliminación a través de WebSocket para que los clientes puedan actualizarse en tiempo real
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "USER_DELETED");
        payload.put("id", id);
        messagingTemplate.convertAndSend("/topic/user-updates", payload);

        return ResponseEntity.ok(new MessageResponse("Usuario eliminado con éxito!"));
    }
}