package com.aprender.backend.domain.dto.request;

import lombok.Data;

@Data
public class ColaboradorRequest {
    private Long usuarioId;
    private String rol;
}
