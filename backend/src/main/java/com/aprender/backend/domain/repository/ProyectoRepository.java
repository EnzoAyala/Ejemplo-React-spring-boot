package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.Proyecto;
import com.aprender.backend.persistence.entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    List<Proyecto> findByUsuarioId(Long usuarioId);
}

