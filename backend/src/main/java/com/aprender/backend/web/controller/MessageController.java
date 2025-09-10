package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.request.MessageRequest;
import com.aprender.backend.domain.dto.response.ChatMessageResponse;
import com.aprender.backend.domain.services.MessageService;
import com.aprender.backend.persistence.entity.Message;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // Enviar mensaje (cifra y guarda)
    @PostMapping
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody MessageRequest req) {
        Message saved = messageService.saveMessage(req.getEmisorId(), req.getReceptorId(), req.getContenido(), req.getChatId());
        ChatMessageResponse res = new ChatMessageResponse(
                saved.getId(),
                messageService.decrypt(saved.getContenido()),
                saved.getFecha(),
                saved.getEmisor().getId(),
                saved.getReceptor().getId(),
                saved.isStatus(),
                saved.getChatId()
        );
        return ResponseEntity.ok(res);
    }

    // Obtener historial de conversación (devuelve ya descifrado)
    @GetMapping("/conversation")
    public ResponseEntity<List<ChatMessageResponse>> getConversation(@RequestParam("user1") Long user1,
                                                                 @RequestParam("user2") Long user2) {
        List<ChatMessageResponse> list = messageService.getConversation(user1, user2).stream()
                .map(m -> new ChatMessageResponse(
                        m.getId(),
                        messageService.decrypt(m.getContenido()),
                        m.getFecha(),
                        m.getEmisor().getId(),
                        m.getReceptor().getId(),
                        m.isStatus(),
                        m.getChatId()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // Marcar como leídos los mensajes para un receptor en ese chat
    @PostMapping("/mark-read")
    public ResponseEntity<Void> markRead(@RequestParam("user1") Long user1,
                                         @RequestParam("user2") Long user2,
                                         @RequestParam("receptor") Long receptorId) {
        messageService.markAsReadFor(user1, user2, receptorId);
        return ResponseEntity.ok().build();
    }
}
