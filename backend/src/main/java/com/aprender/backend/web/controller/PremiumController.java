package com.aprender.backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/premium")
@CrossOrigin(origins = "http://localhost:5173")
public class PremiumController {

    // SOLO USUARIOS CON ROLE_PREMIUM PUEDEN ENTRAR
    @PreAuthorize("hasRole('PREMIUM')")
    @GetMapping("/contenido")
    public ResponseEntity<?> soloPremium() {
        return ResponseEntity.ok("Contenido exclusivo para usuarios PREMIUM");
    }
}
