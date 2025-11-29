package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProyectoResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private String estado;
}
