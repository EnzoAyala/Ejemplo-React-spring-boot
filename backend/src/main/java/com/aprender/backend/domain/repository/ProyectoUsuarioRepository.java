package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.Proyecto_usuario;
import com.aprender.backend.persistence.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProyectoUsuarioRepository extends JpaRepository<Proyecto_usuario, Long> {
    List<Proyecto_usuario> findByUsuario(User usuario);

    List<Proyecto_usuario> findByUsuarioAndEstadoInvitacion(User usuario, String estadoInvitacion);

    List<Proyecto_usuario> findByProyectoIdProyecto(Long proyectoId);

    Optional<Proyecto_usuario> findByProyectoIdProyectoAndUsuarioId(Long proyectoId, Long usuarioId);

    @Transactional
    void deleteByProyectoIdProyectoAndUsuarioId(Long proyectoId, Long usuarioId);
}
