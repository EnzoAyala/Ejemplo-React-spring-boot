package com.aprender.backend.socketconfig;

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

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication; 
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
// import com.aprender.backend.security.jwt.AuthTokenFilter;
import com.aprender.backend.security.jwt.JwtUtils;
import com.aprender.backend.security.services.impl.UserDetailsServiceImpl;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // @Autowired // Inyecta tu filtro de token
    // private AuthTokenFilter authTokenFilter; // O una versión modificada que puedas usar para extraer el token

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/user");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> authorization = accessor.getNativeHeader("Authorization");
                    String token = null;
                    if (authorization != null && !authorization.isEmpty()) {
                        String bearerToken = authorization.get(0);
                        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                            token = bearerToken.substring(7);
                        }
                    }

                    if (token != null) {
                        try {
                            // Reutiliza la lógica de validación JWT
                            // Puedes llamar directamente a los métodos de JwtUtils y UserDetailsServiceImpl
                            // si authTokenFilter no está configurado para ser un bean de Spring,
                            // o si prefieres una autenticación más directa aquí.
                            if (jwtUtils.validateJwtToken(token)) {
                                String username = jwtUtils.getUserNameFromJwtToken(token);
                                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                                // Crea la autenticación de Spring Security
                                Authentication authentication =
                                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                                accessor.setUser(authentication); // Establece el usuario autenticado
                                System.out.println("WebSocket: Usuario autenticado con token: " + username);
                            } else {
                                System.err.println("WebSocket: Token JWT inválido.");
                                // Considera lanzar una excepción o cerrar la conexión si el token es inválido
                            }
                        } catch (Exception e) {
                            System.err.println("Error al autenticar token WebSocket: " + e.getMessage());
                            // throw new MessageDeliveryException("Unauthorized token: " + e.getMessage());
                        }
                    } else {
                        System.out.println("WebSocket: No se encontró token en la conexión CONNECT.");
                        // Si la conexión debe ser autenticada, puedes lanzar una excepción aquí.
                        // throw new MessageDeliveryException("Authentication required for WebSocket connection");
                    }
                }
                return message;
            }
        });
    }
}