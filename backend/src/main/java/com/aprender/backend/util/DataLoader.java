package com.aprender.backend.util;

import com.aprender.backend.persistence.repository.RoleRepository;

import com.aprender.backend.persistence.entity.Role;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

// Esta clase se ejecutará una vez que la aplicación Spring Boot se inicie completamente.
@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_USER"));
            System.out.println("Role ROLE_USER created.");
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
            System.out.println("Role ROLE_ADMIN created.");
        }
    }
}
