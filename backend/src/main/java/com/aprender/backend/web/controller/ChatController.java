package com.aprender.backend.web.controller;

import com.aprender.backend.domain.mappers.MessageMapper;
import com.aprender.backend.domain.dto.request.MessageRequest;
import com.aprender.backend.domain.dto.response.ChatMessageResponse;
import com.aprender.backend.domain.services.MessageService;
import com.aprender.backend.persistence.entity.Message;
import com.aprender.backend.persistence.entity.User;
import com.aprender.backend.domain.repository.UserRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;

    public ChatController(SimpMessagingTemplate messagingTemplate, MessageService messageService, UserRepository userRepository, MessageMapper messageMapper) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.userRepository = userRepository;
        this.messageMapper = messageMapper;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageRequest chatMessage, Principal principal) {
        // Obtener el ID del usuario autenticado desde el Principal
        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Long emisorId = user.getId();

        // Asegurarse de que el emisor del mensaje es el usuario autenticado
        if (!emisorId.equals(chatMessage.getEmisorId())) {
            // Manejar el error, por ejemplo, lanzando una excepción o simplemente ignorando
            return;
        }

        Message saved = messageService.saveMessage(
            chatMessage.getEmisorId(),
            chatMessage.getReceptorId(),
            chatMessage.getContenido(),
            chatMessage.getChatId()
        );

        ChatMessageResponse response = messageMapper.toChatMessageResponse(saved);

        String destination = "/topic/chat/" + saved.getChatId();
        messagingTemplate.convertAndSend(destination, response);
    }
}
