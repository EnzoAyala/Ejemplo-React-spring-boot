package com.aprender.backend.domain.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aprender.backend.persistence.entity.PasswordResetCode;

public interface PasswordReserCodeRepository extends JpaRepository<PasswordResetCode, Long>{
    Optional<PasswordResetCode> findByEmailAndCode(String email, String code);
    void deleteByEmail(String email); // Para borrar codigos precios al generar uno nuevo
}
