package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArchivoResponse {
    private Long id;
    private String nombre;
    private String tipo;
    private String url;
}
