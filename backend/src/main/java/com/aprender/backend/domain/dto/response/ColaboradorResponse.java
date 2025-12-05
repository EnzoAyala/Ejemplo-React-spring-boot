package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColaboradorResponse {
    private Long id;
    private String username;
    private String email;
    private String rolEnProyecto;
    private String estadoInvitacion;
}
