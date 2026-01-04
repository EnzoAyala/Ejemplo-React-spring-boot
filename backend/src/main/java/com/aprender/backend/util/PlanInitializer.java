package com.aprender.backend.util;

import com.aprender.backend.domain.repository.UserRepository;
import com.aprender.backend.domain.repository.UserRolePlanRepository;
import com.aprender.backend.domain.repository.RoleRepository;
import com.aprender.backend.persistence.entity.User;
import com.aprender.backend.persistence.entity.UserRolePlan;
import com.aprender.backend.persistence.entity.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Component
public class PlanInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRolePlanRepository userRolePlanRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {

        // Obtiene el rol de plan gratuito
        Role freePlan = roleRepository.findByName("ROLE_PLAN_GRATUITO")
                .orElseThrow(() -> new RuntimeException("Error: PLAN_GRATUITO no encontrado."));

        // Obtiene todos los usuarios
        List<User> users = userRepository.findAll();

        for (User user : users) {
            boolean hasPlan = userRolePlanRepository.existsByUserId(user.getId());

            if (!hasPlan) {
                // Crear la asignación de plan gratuito
                UserRolePlan urp = new UserRolePlan();
                urp.setUser(user);
                urp.setPlan(freePlan);
                userRolePlanRepository.save(urp);
                System.out.println("Asignado PLAN_GRATUITO a usuario: " + user.getUsername());
            }
        }

        System.out.println("Inicialización de planes completada.");
    }
}
