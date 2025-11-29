package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByProyectoIdProyecto(Long proyectoId);
}
