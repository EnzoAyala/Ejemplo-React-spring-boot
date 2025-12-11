package com.aprender.backend.util;

import com.aprender.backend.domain.repository.RoleRepository;
import com.aprender.backend.persistence.entity.Role;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

// Esta clase se ejecutará una vez que la aplicación Spring Boot se inicie completamente.
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Verifica si el rol ROLE_PLAN_GRATUITO ya existe en la base de datos
        if (roleRepository.findByName("ROLE_PLAN_GRATUITO").isEmpty()) {
            // Si no existe, lo crea y lo guarda
            roleRepository.save(new Role(null, "ROLE_PLAN_GRATUITO")); // null para que el ID sea autogenerado
            System.out.println("Role ROLE_PLAN_GRATUITO created.");
        }

        // Verifica si el rol ROLE_ADMIN ya existe en la base de datos
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            // Si no existe, lo crea y lo guarda
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
            System.out.println("Role ROLE_ADMIN created.");
        }

        // Verifica si el rol ROLE_PLAN_CASUAL ya existe en la base de datos
        if (roleRepository.findByName("ROLE_PLAN_CASUAL").isEmpty()) {
            // Si no existe, lo crea y lo guarda
            roleRepository.save(new Role(null, "ROLE_PLAN_CASUAL"));
            System.out.println("Role ROLE_PLAN_CASUAL created.");
        }

        // Verifica si el rol ROLE_PLAN_PREMIUM ya existe en la base de datos
        if (roleRepository.findByName("ROLE_PLAN_PREMIUM").isEmpty()) {
            // Si no existe, lo crea y lo guarda
            roleRepository.save(new Role(null, "ROLE_PLAN_PREMIUM"));
            System.out.println("Role ROLE_PLAN_PREMIUM created.");
        }
    }
}