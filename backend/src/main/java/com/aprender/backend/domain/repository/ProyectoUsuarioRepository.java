package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.Proyecto_usuario;
import com.aprender.backend.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProyectoUsuarioRepository extends JpaRepository<Proyecto_usuario, Long> {
    List<Proyecto_usuario> findByUsuario(User usuario);
}
