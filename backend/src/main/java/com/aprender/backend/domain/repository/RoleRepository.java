package com.aprender.backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aprender.backend.persistence.entity.ERole;
import com.aprender.backend.persistence.entity.Role;

import java.util.Optional;


// Repositorio para la entidad Role
// JpaRepository<tipo de Entidad, Tipo de la clave primaria>
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Metooo personalizado para encontrar un rol por su nombre (ERole)
    Optional<Role> findByName(ERole name);

}
