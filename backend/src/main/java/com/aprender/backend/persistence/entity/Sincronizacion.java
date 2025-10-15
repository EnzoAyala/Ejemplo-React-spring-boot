package com.aprender.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sincronizacion")
public class Sincronizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sync")
    private Integer idSync;

    @Column(length = 50)
    private String accion;

    @Column(name = "tabla_afectada", length = 50)
    private String tablaAfectada;

    private LocalDateTime fecha;

    @Column(length = 50)
    private String estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private User usuario;
}
