package com.aprender.backend.security.jwt;

import com.aprender.backend.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component // Marca esta clase como un componente de Spring.
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret}") // Inyecta la clave secreta desde application.properties
    private String jwtSecret;

    @Value("${jwt.expirationMs}") // Inyecta la duración de la expiración desde application.properties
    private int jwtExpirationMs;

    // Método para obtener la clave de firma desde la cadena secreta.
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // Genera un token JWT a partir de la autenticación del usuario.
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername())) // Establece el nombre de usuario como sujeto del token
                .setIssuedAt(new Date()) // Establece la fecha de emisión del token
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Establece la fecha de expiración
                .signWith(key(), SignatureAlgorithm.HS256) // Firma el token con la clave secreta usando HS256
                .compact(); // Construye el JWT y lo compacta en una cadena.
    }

    // Obtiene el nombre de usuario de un token JWT.
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // Valida un token JWT.
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}