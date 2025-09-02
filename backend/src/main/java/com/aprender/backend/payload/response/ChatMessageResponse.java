package com.aprender.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatMessageResponse {
    private Long id;
    private String contenido; // descifrado
    private LocalDateTime fecha;
    private Long emisorId;
    private Long receptorId;
    private boolean status; // leído o no
    private String chatId;
}
