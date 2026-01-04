package com.aprender.backend.domain.repository;

import com.aprender.backend.persistence.entity.UserRolePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRolePlanRepository extends JpaRepository<UserRolePlan, Long> {
    
    boolean existsByUserId(Long userId);

}
