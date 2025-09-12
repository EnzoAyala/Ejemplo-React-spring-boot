package com.aprender.backend.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data // Genera getters y setters
@NoArgsConstructor // Genera constructor sin argumentos
@AllArgsConstructor // Genera constructor con argumentos
@Entity 
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20) // Limita la longitud de la columna a 20 caracteres
    private String name;

}
