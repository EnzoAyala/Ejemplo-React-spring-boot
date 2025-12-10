package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private List<UserResponseUser> responsables;
    private List<ArchivoResponse> archivos;
}
