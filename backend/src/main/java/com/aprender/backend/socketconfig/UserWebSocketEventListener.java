package com.aprender.backend.socketconfig;

//import com.aprender.backend.socketconfig.OnNewUserRegisteredEvent;
import com.aprender.backend.model.User;
import com.aprender.backend.repository.UserRepository;
import com.aprender.backend.payload.response.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Component
public class UserWebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Para enviar mensajes a clientes STOMP

    @Autowired
    private UserRepository userRepository;

    // Cuando alguien se conecta
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        Principal userPrincipal = SimpMessageHeaderAccessor.getUser(event.getMessage().getHeaders());

        if (userPrincipal != null) {
            String username = userPrincipal.getName();
            User user = userRepository.findByUsername(username).orElse(null);

            if (user != null) {
                user.setOnline(true);
                user.setLastActive(LocalDateTime.now());
                userRepository.save(user);

                broadcastUserUpdate(user);
                System.out.println("🟢 Usuario conectado: " + username);
            }
        }
    }

    // Cuando alguien se desconecta
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Principal userPrincipal = SimpMessageHeaderAccessor.getUser(event.getMessage().getHeaders());

        if (userPrincipal != null) {
            String username = userPrincipal.getName();
            User user = userRepository.findByUsername(username).orElse(null);

            if (user != null) {
                user.setOnline(false);
                user.setLastActive(LocalDateTime.now());
                userRepository.save(user);

                broadcastUserUpdate(user);
                System.out.println("🔴 Usuario desconectado: " + username);
            }
        }
    }

    private void broadcastUserUpdate(User user) {
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getLastname(),
                user.getDni(),
                user.getPhone(),
                user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()),
                user.isOnline(),
                user.getLastActive());

        messagingTemplate.convertAndSend("/topic/user-updates", userResponse);
    }

    @EventListener
    public void handleNewUserRegistration(OnNewUserRegisteredEvent event) {
        com.aprender.backend.model.User newUser = event.getNewUser();

        // Converir el objeto a User a UserResponse para enviar solo datos relevantes y
        // reducir la carga
        UserResponse userResponse = new UserResponse(
                newUser.getId(),
                newUser.getUsername(),
                newUser.getEmail(),
                newUser.getName(),
                newUser.getLastname(),
                newUser.getDni(),
                newUser.getPhone(),
                newUser.getRoles().stream()
                        .map(role -> role.getName().name()) // convierte ERoles a String (ej. "ROLE_USER")
                        .collect(Collectors.toList()),
                newUser.isOnline(),
                newUser.getLastActive());

        // Enviar el nuevo usuario (en formato UserResponse) a todos los suscriptores
        // del tema /topic/user-updates
        messagingTemplate.convertAndSend("/topic/user-updates", userResponse);
        System.out.println("WebSocket: Nuevo usuario registrado, emitiendo actualización: " + newUser.getUsername());
    }
}