package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ProyectoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private String estado;
    private List<ColaboradorResponse> colaboradores;
    private Double progreso;
    private Long adminId;

    // Constructor with all fields
    public ProyectoResponse(Long id, String nombre, String descripcion, String estado, List<ColaboradorResponse> colaboradores, Double progreso, Long adminId) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
        this.colaboradores = colaboradores;
        this.progreso = progreso;
        this.adminId = adminId;
    }

    // Existing constructor adapted to include progreso, defaulting to 0.0 for now
    public ProyectoResponse(Long id, String nombre, String descripcion, String estado, List<ColaboradorResponse> colaboradores) {
        this(id, nombre, descripcion, estado, colaboradores, 0.0, null); // Default progress
    }
}
