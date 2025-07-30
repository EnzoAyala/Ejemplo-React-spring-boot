package com.aprender.backend.controller;

import com.aprender.backend.socketconfig.OnNewUserRegisteredEvent;
import com.aprender.backend.model.ERole;
import com.aprender.backend.model.Role;
import com.aprender.backend.model.User;
import com.aprender.backend.payload.request.LoginRequest;
import com.aprender.backend.payload.request.SignupRequest;
import com.aprender.backend.payload.response.JwtResponse;
import com.aprender.backend.payload.response.MessageResponse;
import com.aprender.backend.repository.RoleRepository;
import com.aprender.backend.repository.UserRepository;
import com.aprender.backend.security.jwt.TokenBlacklistService;
import com.aprender.backend.security.jwt.JwtUtils;
import com.aprender.backend.security.services.UserDetailsImpl; // Importar UserDetailsImpl
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid; // Para habilitar las validaciones en los DTOs
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// Marca esta clase como un controlador REST.
@RestController
// Define el path base para todos los endpoints en esta clase.
@RequestMapping("/api/auth")
// Permite peticiones CORS desde cualquier origen (para desarrollo). En
// producción, especifica orígenes.

public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder; // El mismo BCryptPasswordEncoder que configuramos en SecurityConfig

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private ApplicationEventPublisher eventPublisher; // Inyectar ApplicationEventPublisher

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    // Endpoint para el inicio de sesión
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Autentica al usuario usando el AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // Almacena la autenticación en el contexto de seguridad de Spring.
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication); // Genera el token JWT

        // Obtiene los detalles del usuario autenticado
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Obtiene los roles del usuario
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Devuelve el token JWT y los detalles del usuario
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));

    }

    // Endpoint para el registro de usuarios
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {

        // Comprueba si el nombre de usuario ya existe
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Este nombre de usuario ya está en uso!"));
        }

        // Comprueba si el correo electrónico ya existe
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Este correo electrónico ya está en uso!"));
        }

        // Crea una nueva cuenta de usuario
        User user = new User(signupRequest.getName(),
                signupRequest.getLastname(),
                signupRequest.getDni(),
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                signupRequest.getPhone(),
                encoder.encode(signupRequest.getPassword())); // ¡Importante: encriptar la contraseña!

        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        // Asigna roles al usuario. Por defecto, siempre será ROLE_USER para el
        // registro.
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: El rol USER no se encuentra."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: El rol ADMIN no se encuentra."));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: El rol USER no se encuentra."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user); // Guarda el nuevo usuario en la base de datos

        // Publicar el evento de nuevo usuarios registrado
        eventPublisher.publishEvent(new OnNewUserRegisteredEvent(this, savedUser));

        return ResponseEntity.ok(new MessageResponse("Usuario registrado con éxito!"));
    }

    // Para el logout
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        // 1. Extraer el token del encabezado de la petición
        String jwt = parseJwtFromRequest(request);

        // 2. Añadir el token a la lista negra para invalidarlo
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            tokenBlacklistService.addToBlacklist(jwt);
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(new MessageResponse("Logout successful!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid token"));
        }
    }

    private String parseJwtFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}