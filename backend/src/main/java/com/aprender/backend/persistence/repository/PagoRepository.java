package com.aprender.backend.persistence.repository;

import com.aprender.backend.persistence.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoRepository extends JpaRepository<Pago, Long> {
}
