package com.aprender.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Usuario que realiza el pago
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Plan comprado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false, length = 20)
    private String metodo;
    // TARJETA, YAPE, PLIN, TRANSFERENCIA

    @Column(nullable = false, length = 20)
    private String estado;
    // PAGADO, VENCIDO, CANCELADO

    // Fecha exacta del pago
    @Column(name = "fecha_pago", nullable = false)
    private LocalDateTime fechaPago;

    // Fecha de vencimiento del plan
    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDateTime fechaVencimiento;
}
