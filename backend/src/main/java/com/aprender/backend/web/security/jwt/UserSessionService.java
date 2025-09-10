package com.aprender.backend.web.security.jwt;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserSessionService {

    // Mapa en memoria: username -> token JWT más reciente
    private final ConcurrentHashMap<String, String> latestTokens = new ConcurrentHashMap<>();

    // Registra/actualiza el token vigente del usuario y retorna el token previo (si lo había)
    public synchronized String replaceToken(String username, String newToken) {
        if (newToken == null) {
            return latestTokens.remove(username);
        }
        return latestTokens.put(username, newToken);
    }

    // Obtiene el token actual registrado para el usuario (si existe)
    public String getCurrentToken(String username) {
        return latestTokens.get(username);
    }

    // Quita el token sólo si coincide con el registrado (para evitar borrar si ya hubo un nuevo login)
    public synchronized void removeIfMatch(String username, String token) {
        String current = latestTokens.get(username);
        if (current != null && current.equals(token)) {
            latestTokens.remove(username);
        }
    }
}
