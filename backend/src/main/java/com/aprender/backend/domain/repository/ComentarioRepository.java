package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
    List<Comentario> findByTarea_IdTarea(Long tareaId);
}
