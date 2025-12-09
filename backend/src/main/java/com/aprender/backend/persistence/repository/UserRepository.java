package com.aprender.backend.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aprender.backend.persistence.entity.User;

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
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = :username")
    Optional<User> findByUsernameWithRoles(@Param("username") String username);

}
