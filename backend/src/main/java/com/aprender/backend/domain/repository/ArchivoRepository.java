package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.Archivo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArchivoRepository extends JpaRepository<Archivo, Integer> {
    List<Archivo> findByTareaIdTarea(Long tareaId);
}
