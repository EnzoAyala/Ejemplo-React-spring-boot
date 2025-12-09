package com.aprender.backend.web.controller;

import com.aprender.backend.domain.services.PagoService;
import com.aprender.backend.persistence.entity.Suscripcion;
import com.aprender.backend.persistence.repository.PagoRepository;
import com.aprender.backend.web.dto.PagoRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PagoController {

    private final PagoService pagoService;
    private final PagoRepository pagoRepository;

    // =========================
    // REGISTRAR PAGO + CREAR SUSCRIPCIÓN + CAMBIAR ROL A PREMIUM
    // =========================
    @PostMapping
    public ResponseEntity<?> registrarPago(@AuthenticationPrincipal UserDetails user,
                                          @RequestBody PagoRequestDTO dto) {
        pagoService.procesarPago(
                user.getUsername(), // obtenemos username desde JWT
                dto.getPlan(),
                dto.getMetodo()
        );

        return ResponseEntity.ok("Pago registrado, suscripción activa y usuario ahora es PREMIUM");
    }

    // =========================
    // CONSULTAR SUSCRIPCIÓN ACTIVA
    // =========================
    @GetMapping("/activo")
    public ResponseEntity<Suscripcion> obtenerSuscripcionActiva(@AuthenticationPrincipal UserDetails user) {
        Suscripcion suscripcion = pagoService.obtenerSuscripcionActiva(user.getUsername());
        return ResponseEntity.ok(suscripcion);
    }

    // =========================
    // REPORTE DE PAGOS (SOLO ADMIN)
    // =========================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/reportes")
    public ResponseEntity<?> obtenerReportePagos() {
        return ResponseEntity.ok(pagoRepository.findAll());
    }
}
