package com.aprender.backend.security.jwt;

// import com.aprender.backend.security.jwt.TokenBlacklistService;
import com.aprender.backend.security.services.impl.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Este filtro se ejecutará una vez por cada petición HTTP.
@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String path = request.getRequestURI();

            // Si la ruta es pública, no procesamos el token JWT
            if (path.startsWith("/api/auth/signin") || path.startsWith("/api/auth/signup")
                    || path.startsWith("/api/auth/forgot-password") || path.startsWith("/api/auth/validate-reset-code")
                    || path.startsWith("/api/auth/reset-password")) {
                filterChain.doFilter(request, response); // Permite que continúe el flujo sin autenticación
                return;
            }

            String jwt = parseJwt(request);
            // Si hay un JWT, NO está en la lista negra, y es válido
            if (jwt != null && !tokenBlacklistService.isBlacklisted(jwt) && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt); // Obtiene el nombre de usuario del token

                // Carga los detalles del usuario desde la base de datos
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Crea un objeto de autenticación
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // La contraseña no se guarda en el token JWT
                        userDetails.getAuthorities()); // Las autoridades (roles) del usuario

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Establece la autenticación en el contexto de seguridad de Spring.
                // Esto indica que el usuario está autenticado para esta petición.
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        // Continúa con la cadena de filtros de seguridad.
        filterChain.doFilter(request, response);
    }

    // Método auxiliar para extraer el JWT del encabezado "Authorization".
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7); // Retorna la cadena después de "Bearer "
        }

        return null;
    }

    // Metodo para WebSocketConfig
    public Authentication getAuthenticationFromJwt(String authToken) {
        if (jwtUtils.validateJwtToken(authToken)) {
            String username = jwtUtils.getUserNameFromJwtToken(authToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        }
        return null;
    }
}