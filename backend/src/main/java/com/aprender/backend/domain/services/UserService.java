package com.aprender.backend.domain.services;

import com.aprender.backend.domain.dto.response.UserResponseDTO;
import com.aprender.backend.persistence.entity.Suscripcion;
import com.aprender.backend.persistence.entity.User;
import com.aprender.backend.persistence.entity.Role;
import com.aprender.backend.persistence.repository.UserRepository;
import com.aprender.backend.persistence.repository.SuscripcionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SuscripcionRepository suscripcionRepository;

    /**
     * Obtiene todos los usuarios junto con sus roles y detalles de suscripción.
     */
    public List<UserResponseDTO> getAllUsersWithDetails() {
        return userRepository.findAll()
                .stream()
                .map(this::mapUserToDTO)
                .collect(Collectors.toList());
    }

    private UserResponseDTO mapUserToDTO(User user) {

        // 1. Buscar la suscripción real en BD
        Suscripcion suscripcion = suscripcionRepository
                .findByUserId(user.getId())
                .orElse(null);

        // 2. Determinar el PLAN 
        String tipo = (suscripcion != null) ? "PREMIUM" : "BASIC";

        // 3. Convertir Roles a List<String>
        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        // 4. Obtener fecha de vencimiento
        LocalDate fechaFin = (suscripcion != null)
                ? suscripcion.getFechaFin().toLocalDate()
                : null;

        // 5. Construir DTO
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roles,
                tipo,
                fechaFin
        );
    }
}
