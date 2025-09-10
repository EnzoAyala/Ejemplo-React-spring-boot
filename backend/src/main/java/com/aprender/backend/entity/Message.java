package com.aprender.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Contenido cifrado del mensaje (AES). Guardado como Base64 (IV + ciphertext)
    @Lob
    @Column(name = "contenido", nullable = false)
    private String contenido;

    // Fecha/hora del mensaje
    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    // Emisor y receptor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_emisor", nullable = false)
    private User emisor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_receptor", nullable = false)
    private User receptor;

    // true = leído, false = no leído
    @Column(name = "status", nullable = false)
    private boolean status = false;

    // Agrupa los mensajes en una conversación
    @Column(name = "chat_id", nullable = false, length = 100)
    private String chatId;

    @PrePersist
    public void prePersist() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
        if (this.emisor != null && this.receptor != null && (this.chatId == null || this.chatId.isBlank())) {
            long a = Math.min(emisor.getId(), receptor.getId());
            long b = Math.max(emisor.getId(), receptor.getId());
            this.chatId = "chat_" + a + "_" + b;
        }
    }
}
