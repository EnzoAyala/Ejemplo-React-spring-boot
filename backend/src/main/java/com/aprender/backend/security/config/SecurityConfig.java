package com.aprender.backend.security.config;

import com.aprender.backend.security.jwt.AuthTokenFilter;
import com.aprender.backend.security.services.impl.UserDetailsServiceImpl;
//import com.aprender.backend.security.jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired; // inclue la linea 4, 9,13, 15, 19 y 21
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.authentication.configurers.userdetails.DaoAuthenticationConfigurer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

//import com.aprender.backend.model.User;

// Esta anotación indica que esta clase es una fuente de definición de beans de Spring.
@Configuration
// Habilita la seguridad web en tu aplicación Spring.
@EnableWebSecurity
// Habilita la seguridad a nivel de método, permitiendo usar @PreAuthorize,
// @PostAuthorize, etc.
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService; // Tu servicio de detalles de usuario

    // @Autowired
    // private AuthTokenFilter authTokenFilter; // Tu filtro JWT

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    // Bean para el codificador de contraseñas.
    // BCryptPasswordEncoder es un algoritmo seguro para encriptar contraseñas.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Define cómo Spring Security debe autenticar a los usuarios.
    // Utiliza tu UserDetailsServiceImpl y el PasswordEncoder.
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Bean para el gestor de autenticación.
    // Se utiliza para autenticar a los usuarios.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Configura la cadena de filtros de seguridad HTTP.
    // Aquí definimos cómo Spring Security manejará las peticiones HTTP.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF para APIs REST (React manejará esto por su cuenta si es necesario)
                .exceptionHandling(exception -> {
                    // Aquí puedes añadir manejo de excepciones para peticiones no autenticadas o no autorizadas
                    // Por ahora, lo dejamos simple, Spring ya maneja 401/403 por defecto.
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").permitAll() // Rutas de autenticación  permitidas sin token
                        .anyRequest().authenticated() // Requerir autenticación para cualquier otra petición
                );

            // Añade tu AuthenticationProvider personalizado
            http.authenticationProvider(authenticationProvider());

            // Añade tu filtro JWT antes del filtro de autenticacion de usuario/contraseña de Spring
            http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}