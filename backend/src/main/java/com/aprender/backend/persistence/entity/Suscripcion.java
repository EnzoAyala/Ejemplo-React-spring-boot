package com.aprender.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "suscripcion")
public class Suscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Un solo usuario puede tener UNA suscripción activa
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Plan actual
    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    // Fecha exacta de inicio
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    // Fecha exacta de vencimiento
    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    // Estado lógico
    @Column(nullable = false, length = 20)
    private String estado; 
    // ACTIVA, VENCIDA, CANCELADA
}



