package com.aprender.backend.repository;

import com.aprender.backend.model.ERole;
import com.aprender.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


// Repositorio para la entidad Role
// JpaRepository<tipo de Entidad, Tipo de la clave primaria>
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Metooo personalizado para encontrar un rol por su nombre (ERole)
    Optional<Role> findByName(ERole name);

}
