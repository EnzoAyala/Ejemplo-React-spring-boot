package com.aprender.backend.domain.dto.request;

import jakarta.validation.constraints.NotBlank; // Para validar que el campo no esté vacío

// DTO para la petición de inicio de sesión
public class LoginRequest {
    @NotBlank // Asegura que el nombre de usuario no esté nulo o vacío
    private String username;

    @NotBlank // Asegura que la contraseña no esté nula o vacía
    private String password;

    // Getters y Setters (Lombok podría generarlos, pero para DTOs simples, explícitos es claro)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}