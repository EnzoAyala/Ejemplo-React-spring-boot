package com.aprender.backend.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TareaRequest {

    @NotBlank
    private String titulo;

    private String descripcion;

    private String fechaEntrega;

    private String prioridad;

    private Long proyectoId;
}
