package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TareaResponse {

    private Long id;
    private String titulo;
    private String descripcion;
    private String estado;
    private String prioridad;
    private String fechaEntrega;
}
