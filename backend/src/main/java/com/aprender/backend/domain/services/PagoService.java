package com.aprender.backend.domain.services;

import com.aprender.backend.persistence.entity.*;
import com.aprender.backend.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final PlanRepository planRepository;
    private final SuscripcionRepository suscripcionRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // =========================
    // PROCESAR PAGO
    // =========================
    @Transactional
    public void procesarPago(String username, String nombrePlan, String metodo) {

        // ===== BUSCAR USUARIO DESDE JWT =====
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // ===== BUSCAR PLAN =====
        Plan plan = planRepository.findByNombre(nombrePlan)
                .orElseThrow(() -> new RuntimeException("Plan no existe"));

        // ===== REGISTRAR PAGO =====
        Pago pago = new Pago();
        pago.setUser(user);
        pago.setPlan(plan);
        pago.setMonto(plan.getPrecio());
        pago.setMetodo(metodo);
        pago.setEstado("PAGADO");
        pago.setFechaPago(LocalDateTime.now());
        pago.setFechaVencimiento(LocalDateTime.now().plusDays(30));

        pagoRepository.save(pago);

        // ===== CREAR O RENOVAR SUSCRIPCIÓN =====
        Suscripcion suscripcion = suscripcionRepository
                .findByUserId(user.getId())
                .orElse(new Suscripcion());

        suscripcion.setUser(user);
        suscripcion.setPlan(plan);
        suscripcion.setFechaInicio(LocalDateTime.now());
        suscripcion.setFechaFin(LocalDateTime.now().plusDays(30));
        suscripcion.setEstado("ACTIVA");

        suscripcionRepository.save(suscripcion);

        // ===== ASIGNAR ROL PREMIUM =====
        Role rolPremium = roleRepository.findByName("ROLE_PREMIUM")
                .orElseThrow(() -> new RuntimeException("Rol PREMIUM no existe en BD"));

        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }

        boolean yaEsPremium = user.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ROLE_PREMIUM"));

        if (!yaEsPremium) {
            user.getRoles().add(rolPremium);
            userRepository.save(user);
        }
    }

    // =========================
    // OBTENER SUSCRIPCIÓN ACTIVA
    // =========================
    public Suscripcion obtenerSuscripcionActiva(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return suscripcionRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("No tiene suscripción activa"));
    }
}
