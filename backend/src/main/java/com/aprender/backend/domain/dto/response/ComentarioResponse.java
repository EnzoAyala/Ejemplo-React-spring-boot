package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioResponse {
    private Integer id;
    private String contenido;
    private String fecha;
    private UserResponseUser autor;
}
