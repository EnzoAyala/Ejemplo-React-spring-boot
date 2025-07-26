package com.aprender.backend.repository;

import com.aprender.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


// Repositorio para la entidad User
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Metodos personalizados para buscar usuarios
    Optional<User> findByUsername(String username); // Buscar por nombre de usuario
    Optional<User> findByEmail(String email); // Buscar por correo electronico

    // Verificar si existe un usuario con el nombre de usuario dado
    boolean existsByUsername(String username);
    // Verificar si existe un usuario con el correo electronico dado
    boolean existsByEmail(String email);

}
