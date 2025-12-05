package com.aprender.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "proyecto_usuario")
public class Proyecto_usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proyecto", nullable = false)
    private Proyecto proyecto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private User usuario;

    @Column(name = "rol_en_proyecto", length = 50)
    private String rolEnProyecto; // Ejemplo: "Líder", "Colaborador", "Observador"

    @Column(name = "estado_invitacion", length = 20)
    private String estadoInvitacion; // "pendiente", "aceptado", "rechazado"
}
