// src/main/java/com/aprender/backend/security/WebSecurityConfig.java

package com.aprender.backend.security; // Corrección del paquete a 'aprender'

import com.aprender.backend.security.jwt.AuthEntryPointJwt;
import com.aprender.backend.security.jwt.AuthTokenFilter;
import com.aprender.backend.security.services.impl.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity // Habilita la seguridad web de Spring
@EnableMethodSecurity // Habilita la seguridad a nivel de método (ej. @PreAuthorize)
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    private AuthTokenFilter authenticationJwtTokenFilter;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite el origen de tu frontend. ¡MUY IMPORTANTE!
        // En desarrollo, puedes usar "http://localhost:5173" o "*" para todos.
        // En producción, DEBE ser el dominio específico de tu frontend.
        configuration.setAllowedOriginPatterns(Arrays.asList("http://192.168.1.2:5173", "http://localhost:5173", "http://26.57.187.96:5173"));
        // Permite los métodos HTTP que vas a usar
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Permite todas las cabeceras (incluyendo Authorization)
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Permite el envío de credenciales (cookies, encabezados de autorización, etc.)
        configuration.setAllowCredentials(true);
        // Define el tiempo máximo que el navegador puede almacenar en caché la
        // respuesta de preflight
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuración CORS a todas las rutas (/**)
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:uploads/");
            }
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable) // Deshabilita CSRF para APIs sin estado (JWT)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/forgot-password").permitAll() // Permitir explícitamente forgot-password
                        .requestMatchers("/api/auth/**", "/ws/info", "/ws/**", "/uploads/**").permitAll() // Login, Register, etc.
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // Configuración estricta de roles:
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN") // Solo ROLE_USER puede acceder a /api/user/**
                        .requestMatchers("/api/admin/**").hasAnyRole("ADMIN") // Solo ROLE_ADMIN puede acceder a /api/admin/**
                        .anyRequest().authenticated() // Cualquier otra petición requiere autenticación (si no está mapeada arriba)
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}