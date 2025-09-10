package com.aprender.backend.security.services;

import com.aprender.backend.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

// Clase que implementa UserDetails de Spring Security para almacenar detalles del usuario.
@EqualsAndHashCode // Genera equals y hashCode automáticamente, útil para comparaciones.
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String username;
    private String email;

    // @JsonIgnore previene que la contraseña se serialice en respuestas JSON.
    @JsonIgnore
    private String password;

    // Lista de autoridades (roles) del usuario.
    private Collection<? extends GrantedAuthority> authorities;

    // Constructor que toma un objeto User y construye un UserDetailsImpl.
    public UserDetailsImpl(Long id, String username, String email, String password,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    // Método estático para construir un UserDetailsImpl a partir de una entidad
    // User.
    public static UserDetailsImpl build(User user) {
        // Convierte los roles del usuario en una lista de SimpleGrantedAuthority.
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                authorities);
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    // Métodos de cuenta (para indicar si la cuenta está expirada, bloqueada, etc.)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}