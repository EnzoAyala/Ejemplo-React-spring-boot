package com.aprender.backend.web.socket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.aprender.backend.domain.services.UserDetailsServiceImpl;
import com.aprender.backend.web.security.jwt.JwtUtils;
import com.aprender.backend.web.security.jwt.TokenBlacklistService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // @Autowired // Inyecta tu filtro de token
    // private AuthTokenFilter authTokenFilter; // O una versión modificada que
    // puedas usar para extraer el token

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/user");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> authHeaders = accessor.getNativeHeader("Authorization");
                    String token = null;

                    if (authHeaders != null && !authHeaders.isEmpty()) {
                        String bearer = authHeaders.get(0);
                        if (bearer.startsWith("Bearer ")) {
                            token = bearer.substring(7);
                        }
                    }

                    if (token != null) {
                        try {
                            if (!jwtUtils.validateJwtToken(token)) {
                                System.err.println("WebSocket: Token inválido");
                                throw new IllegalArgumentException("Token JWT inválido");
                            }

                            // ⚠️ Aquí deberías verificar también la blacklist
                            if (tokenBlacklistService.isBlacklisted(token)) {
                                System.err.println("WebSocket: Token en blacklist");
                                throw new IllegalArgumentException("Token JWT está en la lista negra");
                            }

                            String username = jwtUtils.getUserNameFromJwtToken(token);
                            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                            Authentication authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                            accessor.setUser(authentication);

                            System.out.println("WebSocket: Usuario autenticado: " + username);

                        } catch (Exception e) {
                            System.err.println("WebSocket: Error autenticando token: " + e.getMessage());
                            throw new IllegalArgumentException("Error de autenticación WebSocket: " + e.getMessage());
                        }
                    } else {
                        System.err.println("WebSocket: No se envió token");
                        throw new IllegalArgumentException("Token JWT requerido en cabecera Authorization");
                    }
                }

                return message;
            }

        });
    }
}