package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByUsuario_IdAndLeida(Long usuarioId, boolean leida);
    List<Notificacion> findByUsuario_Id(Long usuarioId);
    void deleteByProyecto_IdProyecto(Long proyectoId);
}
