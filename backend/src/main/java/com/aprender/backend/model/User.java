package com.aprender.backend.model;

import jakarta.persistence.*; // Importa anotaciones JPA para mapeo de entidades
import jakarta.validation.constraints.*; // Importa anotaciones de validación de Jakarta
import lombok.Data; // Anotación de Lombok para generar getters, setters, toString, equals y hashCode
import lombok.NoArgsConstructor; // Anotación de Lombok para generar un constructor sin argumentos
import lombok.AllArgsConstructor; // Anotación de Lombok para generar un constructor con todos los argumentos

import java.util.HashSet; // Importa HashSet para colecciones de roles
import java.util.Set; // Importa Set para colecciones de roles (asegura unicidad)
import java.time.LocalDateTime;

@Data // Genera automáticamente getters, setters, toString, equals y hashCode
@NoArgsConstructor // Genera un constructor sin argumentos
@AllArgsConstructor // Genera un constructor con todos los argumentos
@Entity // Declara que esta clase es una entidad JPA y se mapea a una tabla en la base
        // de datos
@Table(name = "users", // Especifica el nombre de la tabla en la base de datos
        uniqueConstraints = { // Define restricciones de unicidad para columnas
                @UniqueConstraint(columnNames = { "username" }), // El nombre de usuario debe ser único
                @UniqueConstraint(columnNames = { "email" }) // El correo electrónico debe ser único
        })
public class User {

    @Id // Marca esta propiedad como la clave primaria de la tabla
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura la generación automática del ID (auto-incremento)
    private Long id;

    @Column(nullable = false, length = 50) // No puede ser nulo, longitud máxima 50 caracteres
    @NotBlank(message = "El nombre no puede estar vacío") // Validación: No nulo y no vacío
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres") // Validación: Longitud
    private String name;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "El apellido no puede estar vacío") // Validación: No nulo y no vacío
    @Size(min = 3, max = 50, message = "El apellido debe tener entre 3 y 50 caracteres") // Validación: Longitud
    private String lastname; // Campo 'lastname' en minúsculas como lo solicitaste

    @Column(nullable = false, length = 8, unique = true)
    @NotBlank(message = "El DNI no puede estar vacío")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe tener 8 dígitos numéricos") // Validación: 8 dígitos numéricos
    private String dni;

    @Column(nullable = false, length = 50, unique = true)
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @Column(nullable = false, length = 100, unique = true)
    @NotBlank(message = "El correo electrónico no puede estar vacío")
    @Size(max = 100, message = "El correo electrónico no puede exceder los 100 caracteres")
    @Email(message = "El formato del correo electrónico no es válido") // Validación: Formato de email
    private String email;

    @Column(nullable = false, length = 9)
    @NotBlank(message = "El teléfono no puede estar vacío")
    @Pattern(regexp = "^9\\d{8}$", message = "El número de teléfono debe tener 9 dígitos y comenzar con 9")
    private String phone;

    @Column(nullable = false, length = 120) // La contraseña encriptada puede ser larga (BCrypt)
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 6, max = 120, message = "La contraseña debe tener entre 6 y 120 caracteres") // Longitud para textoplano antes de encriptar
    private String password;

    // Relación Many-to-Many con la tabla 'roles'
    @ManyToMany(fetch = FetchType.LAZY) // Carga los roles solo cuando se necesitan (lazy loading)
    @JoinTable(name = "user_roles", // Nombre de la tabla intermedia que mapea usuarios a roles
            joinColumns = @JoinColumn(name = "user_id"), // Columna en user_roles que referencia a la tabla users
            inverseJoinColumns = @JoinColumn(name = "role_id")) // Columna en user_roles que referencia a la tabla roles
    private Set<Role> roles = new HashSet<>(); // Usa un Set para asegurar que no haya roles duplicados para un usuario

    @Column(name = "is_online")
    private boolean isOnline = false;

    @Column(name = "last_active")
    private LocalDateTime lastActive;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private EGender gender;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    // Constructor para registro simplificado (sin ID, usado al crear un nuevo
    // usuario)
    public User(String name, String lastname, String dni, String username, String email, String phone,
            String password) {
        this.name = name;
        this.lastname = lastname; // Asegúrate de que coincida con el campo de la clase
        this.dni = dni;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

}