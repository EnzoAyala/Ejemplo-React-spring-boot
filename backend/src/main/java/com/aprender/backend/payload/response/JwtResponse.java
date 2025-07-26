package com.aprender.backend.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor // Para usarlo con el constructor personalizado si es necesario, aunque Lombok @Data ya lo cubre
public class JwtResponse {
    private String token;
    private String type = "Bearer"; // Tipo de token
    private Long id;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}