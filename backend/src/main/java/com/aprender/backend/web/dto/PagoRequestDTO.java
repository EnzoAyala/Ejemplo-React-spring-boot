package com.aprender.backend.web.dto;

import lombok.Data;

@Data
public class PagoRequestDTO {
    private Long userId;
    private String plan;     // PREMIUM o EMPRESARIAL
    private String metodo;  // TARJETA, YAPE, etc.
}
