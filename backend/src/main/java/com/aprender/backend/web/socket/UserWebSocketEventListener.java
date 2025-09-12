package com.aprender.backend.web.socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.aprender.backend.domain.dto.response.UserResponseAdmin;

import java.util.stream.Collectors;

@Component
public class UserWebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Para enviar mensajes a clientes STOMP

    @EventListener
    public void handleNewUserRegistration(OnNewUserRegisteredEvent event) {
        com.aprender.backend.persistence.entity.User newUser = event.getNewUser();

        // Converir el objeto a User a UserResponse para enviar solo datos relevantes y
        // reducir la carga
        UserResponseAdmin userResponse = new UserResponseAdmin(
                newUser.getId(),
                newUser.getUsername(),
                newUser.getEmail(),
                newUser.getName(),
                newUser.getLastname(),
                newUser.getDni(),
                newUser.getPhone(),
                newUser.getRoles().stream()
                        .map(role -> role.getName()) // convierte ERoles a String (ej. "ROLE_USER")
                        .collect(Collectors.toList()),
                newUser.isOnline(),
                newUser.getLastActive());

        // Enviar el nuevo usuario (en formato UserResponse) a todos los suscriptores
        // del tema /topic/user-updates
        messagingTemplate.convertAndSend("/topic/user-updates", userResponse);
        System.out.println("WebSocket: Nuevo usuario registrado, emitiendo actualización: " + newUser.getUsername());
    }
}