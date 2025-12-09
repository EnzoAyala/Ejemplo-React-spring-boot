package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO para devolver los usuarios con roles y datos de suscripción
 */
@Data
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private List<String> roles;         // lista de nombres de roles
    private String tipo;                // "BASIC" o "PREMIUM"
    private LocalDate fechaFin;         // fecha de vencimiento de la suscripción
}

