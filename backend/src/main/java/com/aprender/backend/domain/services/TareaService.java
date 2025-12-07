package com.aprender.backend.domain.services;

import com.aprender.backend.domain.dto.request.TareaRequest;
import com.aprender.backend.domain.dto.response.TareaResponse;
import com.aprender.backend.domain.repository.ProyectoRepository;
import com.aprender.backend.domain.repository.TareaRepository;
import com.aprender.backend.domain.dto.response.UserResponseUser;
import com.aprender.backend.persistence.entity.Proyecto;
import com.aprender.backend.persistence.entity.Tarea;
import com.aprender.backend.domain.repository.UserRepository;
import com.aprender.backend.persistence.entity.User;
import com.aprender.backend.domain.mappers.UserMapper;
import com.aprender.backend.persistence.entity.Comentario;
import com.aprender.backend.domain.repository.ComentarioRepository;
import com.aprender.backend.domain.dto.request.ComentarioRequest;
import com.aprender.backend.domain.dto.response.ComentarioResponse;
import com.aprender.backend.domain.mappers.ComentarioMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ProyectoService proyectoService; // Inject ProyectoService

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private ComentarioMapper comentarioMapper;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<TareaResponse> getTareasByProyectoId(Long proyectoId) {
        return tareaRepository.findByProyectoIdProyecto(proyectoId).stream()
                .map(this::mapToTareaResponse)
                .collect(Collectors.toList());
    }

    public TareaResponse createTarea(TareaRequest tareaRequest) {
        Proyecto proyecto = proyectoRepository.findById(tareaRequest.getProyectoId())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        User responsable;
        if (tareaRequest.getResponsableId() != null) {
            responsable = userRepository.findById(tareaRequest.getResponsableId())
                    .orElseThrow(() -> new RuntimeException("Usuario responsable no encontrado"));
        } else {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = userDetails.getUsername();
            responsable = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        }

        Tarea tarea = new Tarea();
        tarea.setTitulo(tareaRequest.getTitulo());
        tarea.setDescripcion(tareaRequest.getDescripcion());
        if (tareaRequest.getFechaEntrega() != null && !tareaRequest.getFechaEntrega().isEmpty()) {
            tarea.setFechaEntrega(LocalDate.parse(tareaRequest.getFechaEntrega()));
        }
        tarea.setPrioridad(tareaRequest.getPrioridad());
        tarea.setEstado("pendiente"); // Default state
        tarea.setProyecto(proyecto);
        tarea.setResponsable(responsable);
        Tarea nuevaTarea = tareaRepository.save(tarea);
        proyectoService.recalculateAndSetProjectState(proyecto.getIdProyecto()); // Recalculate project state
        return mapToTareaResponse(nuevaTarea);
    }

    public TareaResponse updateTarea(Long id, TareaRequest tareaRequest) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        Long proyectoId = tarea.getProyecto().getIdProyecto(); // Get project ID before potential update

        if (tareaRequest.getResponsableId() != null) {
            User responsable = userRepository.findById(tareaRequest.getResponsableId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            tarea.setResponsable(responsable);
        }

        tarea.setTitulo(tareaRequest.getTitulo());
        tarea.setDescripcion(tareaRequest.getDescripcion());
        if (tareaRequest.getFechaEntrega() != null && !tareaRequest.getFechaEntrega().isEmpty()) {
            tarea.setFechaEntrega(LocalDate.parse(tareaRequest.getFechaEntrega()));
        }
        tarea.setPrioridad(tareaRequest.getPrioridad());
        Tarea tareaActualizada = tareaRepository.save(tarea);
        proyectoService.recalculateAndSetProjectState(proyectoId); // Recalculate project state
        return mapToTareaResponse(tareaActualizada);
    }

    public void deleteTarea(Long id) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        Long proyectoId = tarea.getProyecto().getIdProyecto(); // Get project ID before deletion
        tareaRepository.deleteById(id);
        proyectoService.recalculateAndSetProjectState(proyectoId); // Recalculate project state
    }

    public TareaResponse updateEstado(Long id, String estado) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        tarea.setEstado(estado);
        Tarea tareaActualizada = tareaRepository.save(tarea);
        proyectoService.recalculateAndSetProjectState(tareaActualizada.getProyecto().getIdProyecto()); // Recalculate project state
        return mapToTareaResponse(tareaActualizada);
    }

    private TareaResponse mapToTareaResponse(Tarea tarea) {
        String fechaEntrega = tarea.getFechaEntrega() != null ? tarea.getFechaEntrega().toString() : null;
        UserResponseUser responsable = userMapper.toUserResponseUser(tarea.getResponsable());
        return new TareaResponse(
                tarea.getIdTarea(),
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getEstado(),
                tarea.getPrioridad(),
                fechaEntrega,
                responsable
        );
    }

    // Comentarios
    @Transactional(readOnly = true)
    public List<ComentarioResponse> getComentarios(Long tareaId) {
        tareaRepository.findById(tareaId).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        return comentarioRepository.findByTarea_IdTarea(tareaId).stream()
                .map(comentarioMapper::toComentarioResponse)
                .collect(Collectors.toList());
    }

    public ComentarioResponse addComentario(Long tareaId, ComentarioRequest request) {
        Tarea tarea = tareaRepository.findById(tareaId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        User autor = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Comentario c = new Comentario();
        c.setContenido(request.getContenido());
        c.setFecha(java.time.LocalDateTime.now());
        c.setTarea(tarea);
        c.setUsuario(autor);
        Comentario saved = comentarioRepository.save(c);

        ComentarioResponse comentarioResponse = comentarioMapper.toComentarioResponse(saved);

        // Enviar por WebSocket
        messagingTemplate.convertAndSend("/topic/tarea/" + tareaId + "/comentarios", comentarioResponse);

        return comentarioResponse;
    }
}