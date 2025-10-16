package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByProyectoId(Long proyectoId);
    List<Tarea> findByResponsableId(Long responsableId);
    List<Tarea> findByEstado(String estado);
    List<Tarea> findByPrioridad(String prioridad);
    List<Tarea> findByProyectoIdAndEstado(Long proyectoId, String estado);
}