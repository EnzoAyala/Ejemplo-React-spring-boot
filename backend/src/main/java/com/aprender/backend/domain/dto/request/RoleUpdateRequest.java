package com.aprender.backend.domain.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class RoleUpdateRequest {
    @NotNull
    private Long userId;

    @NotNull
    @Size(min = 1, message = "Debe especificar al menos un rol")
    private Set<String> roles; // ej. ["user"], ["admin"] o ["user", "admin"]

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}