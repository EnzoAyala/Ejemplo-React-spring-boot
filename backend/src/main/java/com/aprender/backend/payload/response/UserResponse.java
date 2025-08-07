package com.aprender.backend.payload.response;

import java.time.LocalDateTime;
import java.util.List;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String lastname;
    private String dni;
    private String phone;
    private List<String> roles; // Representa los roles como Strings (ej. "ROLE_USER", "ROLE_ADMIN")

    private Boolean isOnline;
    private LocalDateTime lastActive;

    public UserResponse(Long id, String username, String email, String name, String lastname, String dni, String phone, List<String> roles, Boolean isOnline, LocalDateTime lastActive) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.phone = phone;
        this.roles = roles;
        this.isOnline = isOnline;
        this.lastActive = lastActive;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getLastname() {
        return lastname;
    }

    public String getDni() {
        return dni;
    }

    public String getPhone() {
        return phone;
    }

    public List<String> getRoles() {
        return roles;
    }

    public Boolean isOnline() {
        return isOnline;
    }

    public LocalDateTime getLastActive() {
        return lastActive;
    }

    // Setters (opcional si solo se usa para respuesta, pero buena práctica para DTOs)
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }

    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }
}