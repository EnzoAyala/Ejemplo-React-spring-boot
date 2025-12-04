package com.aprender.backend.domain.services;

import com.aprender.backend.domain.dto.request.ColaboradorRequest;
import com.aprender.backend.domain.dto.request.ProyectoRequest;
import com.aprender.backend.domain.dto.response.ColaboradorResponse;
import com.aprender.backend.domain.dto.response.ProyectoResponse;
import com.aprender.backend.domain.repository.ProyectoRepository;
import com.aprender.backend.domain.repository.UserRepository;
import com.aprender.backend.persistence.entity.Proyecto;
import com.aprender.backend.persistence.entity.User;
import com.aprender.backend.domain.repository.ProyectoUsuarioRepository;
import com.aprender.backend.persistence.entity.Proyecto_usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProyectoService {

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProyectoUsuarioRepository proyectoUsuarioRepository;

    public List<ProyectoResponse> getAllProyectos() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return proyectoUsuarioRepository.findByUsuario(user).stream()
                .map(Proyecto_usuario::getProyecto)
                .map(this::mapToProyectoResponse)
                .collect(Collectors.toList());
    }

    public ProyectoResponse createProyecto(ProyectoRequest proyectoRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = new Proyecto();
        proyecto.setNombre(proyectoRequest.getNombre());
        proyecto.setDescripcion(proyectoRequest.getDescripcion());
        proyecto.setEstado("activo"); // Default state
        proyecto.setFechaCreacion(LocalDateTime.now());
        proyecto.setAdmin(user);
        Proyecto nuevoProyecto = proyectoRepository.save(proyecto);

        Proyecto_usuario proyectoUsuario = new Proyecto_usuario();
        proyectoUsuario.setProyecto(nuevoProyecto);
        proyectoUsuario.setUsuario(user);
        proyectoUsuario.setRolEnProyecto("Administrador");
        proyectoUsuarioRepository.save(proyectoUsuario);

        return mapToProyectoResponse(nuevoProyecto);
    }

    public ProyectoResponse updateProyecto(Long id, ProyectoRequest proyectoRequest) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        proyecto.setNombre(proyectoRequest.getNombre());
        proyecto.setDescripcion(proyectoRequest.getDescripcion());
        Proyecto proyectoActualizado = proyectoRepository.save(proyecto);
        return mapToProyectoResponse(proyectoActualizado);
    }

    public void deleteProyecto(Long id) {
        proyectoRepository.deleteById(id);
    }

    public ProyectoResponse updateEstado(Long id, String estado) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        proyecto.setEstado(estado);
        Proyecto proyectoActualizado = proyectoRepository.save(proyecto);
        return mapToProyectoResponse(proyectoActualizado);
    }

    public ProyectoResponse getProyectoById(Long id) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        return mapToProyectoResponse(proyecto);
    }

    private ProyectoResponse mapToProyectoResponse(Proyecto proyecto) {
        List<ColaboradorResponse> colaboradores = getColaboradores(proyecto.getIdProyecto());
        return new ProyectoResponse(
                proyecto.getIdProyecto(),
                proyecto.getNombre(),
                proyecto.getDescripcion(),
                proyecto.getEstado(),
                colaboradores
        );
    }

    // Métodos para Colaboradores

    public List<ColaboradorResponse> getColaboradores(Long proyectoId) {
        return proyectoUsuarioRepository.findByProyectoIdProyecto(proyectoId).stream()
                .map(pu -> new ColaboradorResponse(
                        pu.getUsuario().getId(),
                        pu.getUsuario().getUsername(),
                        pu.getUsuario().getEmail(),
                        pu.getRolEnProyecto()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public ColaboradorResponse agregarColaborador(Long proyectoId, ColaboradorRequest request) throws AccessDeniedException {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        // Auth check
        checkIsAdmin(proyecto);

        User usuarioAAgregar = userRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario a agregar no encontrado"));

        if (proyectoUsuarioRepository.findByProyectoIdProyectoAndUsuarioId(proyectoId, request.getUsuarioId()).isPresent()) {
            throw new RuntimeException("El usuario ya es colaborador de este proyecto.");
        }

        Proyecto_usuario nuevoColaborador = new Proyecto_usuario();
        nuevoColaborador.setProyecto(proyecto);
        nuevoColaborador.setUsuario(usuarioAAgregar);
        nuevoColaborador.setRolEnProyecto(request.getRol());
        proyectoUsuarioRepository.save(nuevoColaborador);

        return new ColaboradorResponse(
                usuarioAAgregar.getId(),
                usuarioAAgregar.getUsername(),
                usuarioAAgregar.getEmail(),
                request.getRol()
        );
    }

    @Transactional
    public void eliminarColaborador(Long proyectoId, Long usuarioId) throws AccessDeniedException {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        // Auth check
        checkIsAdmin(proyecto);

        User usuarioAEliminar = userRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario a eliminar no encontrado"));
        
        if (proyecto.getAdmin().getId().equals(usuarioId)) {
            throw new RuntimeException("No se puede eliminar al administrador del proyecto.");
        }

        proyectoUsuarioRepository.deleteByProyectoIdProyectoAndUsuarioId(proyectoId, usuarioId);
    }
    
    private void checkIsAdmin(Proyecto proyecto) throws AccessDeniedException {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        if (!proyecto.getAdmin().getUsername().equals(username)) {
            throw new AccessDeniedException("Solo el administrador del proyecto puede realizar esta acción.");
        }
    }
}
