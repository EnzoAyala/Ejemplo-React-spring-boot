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
@Table(name = "comentario")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comentario")
    private Integer idComentario;

    @Column(name = "archivo_nombre")
    private String archivoNombre;

    @Column(name = "contenido ", length = 500, nullable = false, columnDefinition = "TEXT")
    private String contenido;

    private LocalDateTime fecha;

    @Column(length = 255)
    private String menciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tarea", nullable = false)
    private Tarea tarea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private User usuario;
}
