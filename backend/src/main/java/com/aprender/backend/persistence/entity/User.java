package com.aprender.backend.persistence.entity;

import jakarta.persistence.*; 
import jakarta.validation.constraints.*; 
import lombok.Data; 
import lombok.NoArgsConstructor; 
import lombok.AllArgsConstructor;

import java.util.HashSet; 
import java.util.Set; 
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = { "username" }),
                @UniqueConstraint(columnNames = { "email" })
        })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    private String name;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(min = 3, max = 50, message = "El apellido debe tener entre 3 y 50 caracteres")
    private String lastname;

    @Column(nullable = false, length = 8, unique = true)
    @NotBlank(message = "El DNI no puede estar vacío")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe tener 8 dígitos numéricos")
    private String dni;

    @Column(nullable = false, length = 50, unique = true)
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @Column(nullable = false, length = 100, unique = true)
    @NotBlank(message = "El correo electrónico no puede estar vacío")
    @Size(max = 100, message = "El correo electrónico no puede exceder los 100 caracteres")
    @Email(message = "El formato del correo electrónico no es válido")
    private String email;

    @Column(nullable = false, length = 9)
    @NotBlank(message = "El teléfono no puede estar vacío")
    @Pattern(regexp = "^9\\d{8}$", message = "El número de teléfono debe tener 9 dígitos y comenzar con 9")
    private String phone;

    @Column(nullable = false, length = 120)
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 6, max = 120, message = "La contraseña debe tener entre 6 y 120 caracteres")
    private String password;

    // Relación Many-to-Many con Role mediante tabla intermedia user_roles
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @Column(name = "is_online")
    private boolean isOnline = false;

    @Column(name = "last_active")
    private LocalDateTime lastActive;

    @Column(length = 10)
    private String gender;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "description")
    private String description;

    // Constructor para registro simplificado (sin ID)
    public User(String name, String lastname, String dni, String username, String email, String phone, String password) {
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }
}
