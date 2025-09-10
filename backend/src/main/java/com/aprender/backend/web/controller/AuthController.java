package com.aprender.backend.web.controller;

import com.aprender.backend.web.security.jwt.JwtUtils;
import com.aprender.backend.web.security.jwt.TokenBlacklistService;
import com.aprender.backend.web.security.jwt.UserSessionService;
import com.aprender.backend.web.socket.OnNewUserRegisteredEvent;
import com.aprender.backend.domain.dto.request.LoginRequest;
import com.aprender.backend.domain.dto.request.SignupRequest;
import com.aprender.backend.domain.dto.response.JwtResponse;
import com.aprender.backend.domain.dto.response.MessageResponse;
import com.aprender.backend.domain.dto.response.UserResponseAdmin;
import com.aprender.backend.domain.repository.PasswordReserCodeRepository;
import com.aprender.backend.domain.repository.RoleRepository;
import com.aprender.backend.domain.repository.UserRepository;
import com.aprender.backend.domain.services.PasswordResetService;
import com.aprender.backend.domain.services.UserDetailsImpl;
import com.aprender.backend.persistence.entity.EGender;
import com.aprender.backend.persistence.entity.ERole;
import com.aprender.backend.persistence.entity.PasswordResetCode;
import com.aprender.backend.persistence.entity.Role;
import com.aprender.backend.persistence.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid; // Para habilitar las validaciones en los DTOs
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@RestController // Marca esta clase como un controlador REST.
@RequestMapping("/api/auth") // Define el path base para todos los endpoints en esta clase.
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
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private UserSessionService userSessionService;

    @Autowired
    private PasswordResetService passwordResetService; // Para enviar correo

    @Autowired
    private PasswordReserCodeRepository passwordResetCodeRepository;

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

        // Actualiza el usuario en la base de datos para reflejar que está en línea
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user != null) {
            user.setOnline(true);
            user.setLastActive(LocalDateTime.now());
            userRepository.save(user);
        }

        // Obtiene los roles del usuario
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Emitir actualización de estado via WebSocket (online)
        if (user != null) {
            UserResponseAdmin userResponse = new UserResponseAdmin(
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
            messagingTemplate.convertAndSend("/topic/user-updates", userResponse);
        }

        // Registrar el token como el más reciente y blacklistear el previo (si existía)
        String previousToken = userSessionService.replaceToken(userDetails.getUsername(), jwt);
        if (previousToken != null && !previousToken.equals(jwt)) {
            tokenBlacklistService.addToBlacklist(previousToken);
        }

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

        if (signupRequest.getGender() != null) {
            String genderStr = signupRequest.getGender().toUpperCase();
            try {
                EGender gender = EGender.valueOf(genderStr);
                user.setGender(gender);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Género inválido."));
            }
        }

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

            String username = jwtUtils.getUserNameFromJwtToken(jwt);

            Optional<User> userOptional = userRepository.findByUsername(username);
            if(userOptional.isPresent()) {
                User user = userOptional.get();
                user.setOnline(false);
                user.setLastActive(java.time.LocalDateTime.now());
                userRepository.save(user);

                // Emitir actualización de estado via WebSocket (offline)
                List<String> roles = user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList());
                UserResponseAdmin userResponse = new UserResponseAdmin(
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
                messagingTemplate.convertAndSend("/topic/user-updates", userResponse);
            }

            tokenBlacklistService.addToBlacklist(jwt);
            // Eliminar token vigente del mapa solo si coincide con el que se está cerrando
            userSessionService.removeIfMatch(username, jwt);

            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(new MessageResponse("Logout exitoso!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Token invalido o no encontrado"));
        }
    }

    private String parseJwtFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }

    // Para restaurar la contraseña de un usuario
    public String generateSixDigitCode() {
        Random random = new Random();
        int code = 10000 + random.nextInt(90000);
        return String.valueOf(code);
    }

    // Endpoint para el restablecimiento de contraseña
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // Verificamos si el usuario existe
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: No se encontró un usuario con ese correo."));
        }

        // Elimina codigos previos para este email
        passwordResetCodeRepository.deleteByEmail(email);

        String code = generateSixDigitCode();
        Date expirationDate = new Date(System.currentTimeMillis() + 5 * 60 * 1000); // 5 minutos de expiración

        PasswordResetCode resetCode = new PasswordResetCode();
        resetCode.setEmail(email);
        resetCode.setCode(code);
        resetCode.setExpirationDate(expirationDate);
        passwordResetCodeRepository.save(resetCode);

        try {
            passwordResetService.sendResetCodeEmail(userOptional.get(), code);
        } catch (jakarta.mail.MessagingException e) {
            return ResponseEntity
                    .internalServerError()
                    .body(new MessageResponse("Error al enviar el correo de restablecimiento de contraseña."));
        }

        return ResponseEntity
                .ok(new MessageResponse("Se ha enviado un codigo de 6 dígitos para restablecer la contraseña."));
    }

    // Endpoint para validar el código de restablecimiento de contraseña
    @PostMapping("/validate-reset-code")
    public ResponseEntity<?> validateResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        Optional<PasswordResetCode> resetCodeOptional = passwordResetCodeRepository.findByEmailAndCode(email, code);
        if (!resetCodeOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Código inválido."));
        }

        PasswordResetCode resetCode = resetCodeOptional.get();

        if (resetCode.getExpirationDate().before(new Date())) {
            return ResponseEntity.badRequest().body(new MessageResponse("El código ha expirado."));
        }

        return ResponseEntity.ok(new MessageResponse("Código válido."));
    }

    // Endpoint para restablecer la contraseña
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String newPassword = request.get("password");

        Optional<PasswordResetCode> resetCodeOptional = passwordResetCodeRepository.findByEmailAndCode(email, code);
        if (!resetCodeOptional.isPresent() || resetCodeOptional.get().getExpirationDate().before(new Date())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Código inválido o expirado."));
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Usuario no encontrado."));
        }

        User user = userOptional.get();
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        // Elimina el código tras usarlo
        passwordResetCodeRepository.delete(resetCodeOptional.get());

        return ResponseEntity.ok(new MessageResponse("Contraseña restablecida con éxito."));
    }

}