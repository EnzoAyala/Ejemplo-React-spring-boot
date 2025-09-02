package com.aprender.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequest {
    @NotNull
    private Long emisorId;

    @NotNull
    private Long receptorId;

    private String chatId; // opcional, si no se envía se calcula

    @NotBlank
    private String contenido; // texto plano, el backend lo cifrará antes de guardar
}
