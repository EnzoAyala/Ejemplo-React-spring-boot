package com.aprender.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "plan")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String nombre; // GRATIS, PREMIUM, EMPRESARIAL

    @Column(nullable = false)
    private Double precio;

    @Column(length = 255)
    private String descripcion;
}
