package com.aprender.backend.socketconfig;

import com.aprender.backend.model.User;
import com.aprender.backend.payload.response.UserResponseAdmin;
import com.aprender.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.messaging.simp.user.SimpUserRegistry;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
public class UserPresenceEventListener {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private SimpUserRegistry simpUserRegistry;

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    @EventListener
    @Transactional
    public void handleSessionConnected(SessionConnectedEvent event) {
        Principal principal = event.getUser();
        if (principal == null) return;

        String username = principal.getName();
        Optional<User> userOptional = userRepository.findByUsernameWithRoles(username);
        if (userOptional.isEmpty()) return;

        User user = userOptional.get();
        user.setOnline(true);
        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        UserResponseAdmin payload = new UserResponseAdmin(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getLastname(),
                user.getDni(),
                user.getPhone(),
                roles,
                user.isOnline(),
                user.getLastActive()
        );
        messagingTemplate.convertAndSend("/topic/user-updates", payload);
    }

    @EventListener
    @Transactional
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        Principal principal = event.getUser();
        if (principal == null) return;

        String username = principal.getName();

        // Diferir el marcado como offline para cubrir refresh (reconexión inmediata)
        scheduler.schedule(() -> {
            try {
                // Si el usuario tiene alguna sesión activa, no marcar offline
                var simpUser = simpUserRegistry.getUser(username);
                if (simpUser != null && !simpUser.getSessions().isEmpty()) {
                    return;
                }

                Optional<User> userOptional = userRepository.findByUsernameWithRoles(username);
                if (userOptional.isEmpty()) return;

                User user = userOptional.get();
                user.setOnline(false);
                user.setLastActive(LocalDateTime.now());
                userRepository.save(user);

                List<String> roles = user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList());

                UserResponseAdmin payload = new UserResponseAdmin(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getName(),
                        user.getLastname(),
                        user.getDni(),
                        user.getPhone(),
                        roles,
                        user.isOnline(),
                        user.getLastActive()
                );
                messagingTemplate.convertAndSend("/topic/user-updates", payload);
            } catch (Exception ignored) {
            }
        }, 5, TimeUnit.SECONDS);
    }
}
