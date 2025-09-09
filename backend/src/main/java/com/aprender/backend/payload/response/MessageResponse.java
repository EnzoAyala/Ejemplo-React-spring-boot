package com.aprender.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageResponse {
    // Para enviar mensajes de respuestas a errores o éxitos al frontend
    private String message;
}
