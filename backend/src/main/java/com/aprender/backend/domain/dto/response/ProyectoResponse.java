package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProyectoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private String estado;
    private List<ColaboradorResponse> colaboradores;

    public ProyectoResponse(Long id, String nombre, String descripcion, String estado) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
    }
}
