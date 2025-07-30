package com.aprender.backend.security.jwt;

import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Servicio para gestionar una lista negra (blacklist) de tokens JWT invalidados.
 * Esta es una implementación simple en memoria. Para un entorno de producción,
 * especialmente con múltiples instancias, se recomienda usar una solución
 * distribuida como Redis con un TTL (Time-To-Live) para los tokens.
 */
@Service
public class TokenBlacklistService {

    // Usamos un ConcurrentHashMap para manejar la concurrencia de forma segura.
    // El Set almacenará los tokens invalidados.
    private final Set<String> blacklist = ConcurrentHashMap.newKeySet();

    public void addToBlacklist(String token) {
        blacklist.add(token);
    }

    public boolean isBlacklisted(String token) {
        return blacklist.contains(token);
    }
}
