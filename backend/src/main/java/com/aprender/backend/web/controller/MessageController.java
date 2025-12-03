package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.response.ChatMessageResponse;
import com.aprender.backend.domain.mappers.MessageMapper;
import com.aprender.backend.domain.services.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final MessageMapper messageMapper;

    public MessageController(MessageService messageService, MessageMapper messageMapper) {
        this.messageService = messageService;
        this.messageMapper = messageMapper;
    }


    // Obtener historial de conversación (devuelve ya descifrado)
    @GetMapping("/conversation")
    public ResponseEntity<List<ChatMessageResponse>> getConversation(@RequestParam("user1") Long user1,
                                                                 @RequestParam("user2") Long user2) {
        List<ChatMessageResponse> list = messageService.getConversation(user1, user2).stream()
                .map(messageMapper::toChatMessageResponse)
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
