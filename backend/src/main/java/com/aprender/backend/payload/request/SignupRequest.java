package com.aprender.backend.payload.request;

import jakarta.validation.constraints.Email; // Para validar formato de email
import jakarta.validation.constraints.NotBlank; // Para validar que no esté vacío
import jakarta.validation.constraints.Size; // Para validar longitud
import jakarta.validation.constraints.Pattern; // Para validación de patrones (regex)

import java.util.Set; // Para los roles, aunque por defecto será USER

// DTO para la petición de registro de usuario
public class SignupRequest {
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    private String name;

    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(min = 3, max = 50, message = "El apellido debe tener entre 3 y 50 caracteres")
    private String lastname; 

    @NotBlank(message = "El DNI no puede estar vacío")
    @Size(min = 8, max = 8, message = "El DNI debe tener 8 dígitos") // Longitud exacta de 8
    @Pattern(regexp = "\\d{8}", message = "El DNI debe ser numérico y tener 8 dígitos")
    private String dni;

    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @NotBlank(message = "El correo electrónico no puede estar vacío")
    @Size(max = 100, message = "El correo electrónico no puede exceder los 100 caracteres")
    @Email(message = "El formato del correo electrónico no es válido") // Valida el formato de email
    private String email;

    @NotBlank(message = "El teléfono no puede estar vacío")
    @Size(min = 9, max = 9, message = "El teléfono debe tener 9 dígitos") // Longitud exacta de 9
    @Pattern(regexp = "^9\\d{8}$", message = "El número de teléfono debe tener 9 dígitos y comenzar con 9") // Valida
                                                                                                            // formato
                                                                                                            // de
                                                                                                            // teléfono
    private String phone;

    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 6, max = 40, message = "La contraseña debe tener entre 6 y 40 caracteres") // La longitud de la
                                                                                           // contraseña en texto plano
    private String password;

    // Campo para roles, aunque para el registro será siempre "user" por defecto.
    // Se puede usar para permitir que un admin registre otros roles si fuera
    // necesario.
    private Set<String> roles; // Puede ser 'user', 'admin'

    // Getters y Setters (generados por Lombok con @Data, pero explícitos para
    // claridad aquí)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() { // ¡Importante! Getter para 'lastname'
        return lastname;
    }

    public void setLastname(String lastname) { // ¡Importante! Setter para 'lastname'
        this.lastname = lastname;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return this.roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}