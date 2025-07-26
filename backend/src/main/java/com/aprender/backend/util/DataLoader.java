package com.aprender.backend.util;

import com.aprender.backend.model.ERole;
import com.aprender.backend.model.Role;
import com.aprender.backend.repository.RoleRepository;
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
        // Verifica si el rol ROLE_USER ya existe en la base de datos
        if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
            // Si no existe, lo crea y lo guarda
            roleRepository.save(new Role(null, ERole.ROLE_USER)); // null para que el ID sea autogenerado
            System.out.println("Role ROLE_USER created.");
        }

        // Verifica si el rol ROLE_ADMIN ya existe en la base de datos
        if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
            // Si no existe, lo crea y lo guarda
            roleRepository.save(new Role(null, ERole.ROLE_ADMIN));
            System.out.println("Role ROLE_ADMIN created.");
        }
    }
}