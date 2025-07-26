package com.aprender.backend.security.services.impl;

import com.aprender.backend.model.User;
import com.aprender.backend.repository.UserRepository;
import com.aprender.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Esta anotación marca esta clase como un servicio de Spring.
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired // Inyecta el UserRepository para acceder a los datos de usuario.
    private UserRepository userRepository;

    // Este método es implementado de UserDetailsService.
    // Spring Security lo llama cuando necesita cargar los detalles de un usuario.
    @Override
    @Transactional // Asegura que la operación de carga se realice dentro de una transacción de base de datos.
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca el usuario en la base de datos por su nombre de usuario o email.
        // En este caso, buscamos solo por username, pero podríamos extenderlo para email.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Construye y devuelve un objeto UserDetailsImpl a partir del usuario encontrado.
        return UserDetailsImpl.build(user);
    }
}