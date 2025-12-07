package com.aprender.backend.domain.services;

import com.aprender.backend.domain.dto.request.ColaboradorRequest;
import com.aprender.backend.domain.dto.request.ProyectoRequest;
import com.aprender.backend.domain.dto.response.ColaboradorResponse;
import com.aprender.backend.domain.dto.response.ProyectoResponse;
import com.aprender.backend.domain.mappers.NotificacionMapper;
import com.aprender.backend.domain.repository.ProyectoRepository;
import com.aprender.backend.domain.repository.UserRepository;
import com.aprender.backend.persistence.entity.Notificacion;
import com.aprender.backend.persistence.entity.Proyecto;
import com.aprender.backend.persistence.entity.User;
import com.aprender.backend.domain.repository.ProyectoUsuarioRepository;
import com.aprender.backend.persistence.entity.Proyecto_usuario;
import com.aprender.backend.persistence.entity.Tarea; // Added import
import com.aprender.backend.domain.repository.TareaRepository; // Added import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @Autowired
    private TareaRepository tareaRepository; // Inject TareaRepository

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificacionMapper notificacionMapper;

    public List<ProyectoResponse> getAllProyectos() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return proyectoUsuarioRepository.findByUsuarioAndEstadoInvitacion(user, "aceptado").stream()
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
        proyectoUsuario.setEstadoInvitacion("aceptado");
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

    @Transactional
    public void deleteProyecto(Long id) {
        // Primero eliminar notificaciones asociadas directamente al proyecto (invitaciones, etc.)
        notificacionService.deleteByProyectoId(id);
        // Luego borrar el proyecto; por cascada se eliminarán tareas y sus notificaciones/comentarios/subtareas/archivos
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

    @Transactional
    public void recalculateAndSetProjectState(Long proyectoId) {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        List<Tarea> tasks = tareaRepository.findByProyectoIdProyecto(proyectoId);
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream()
                .filter(tarea -> "completada".equals(tarea.getEstado()))
                .count();

        Double currentProgress = totalTasks > 0 ? (double) completedTasks / totalTasks * 100.0 : 0.0;

        if (currentProgress >= 100.0 && !"finalizado".equals(proyecto.getEstado())) {
            proyecto.setEstado("finalizado");
            proyectoRepository.save(proyecto);
        } else if (currentProgress < 100.0 && "finalizado".equals(proyecto.getEstado())) {
            // If the project was finalizado but now has incomplete tasks
            // For simplicity, let's revert to "activo" if it was "finalizado"
            proyecto.setEstado("activo");
            proyectoRepository.save(proyecto);
        }
    }

    private ProyectoResponse mapToProyectoResponse(Proyecto proyecto) {
        List<ColaboradorResponse> colaboradores = getColaboradores(proyecto.getIdProyecto());

        // Calculate progress
        List<Tarea> tasks = tareaRepository.findByProyectoIdProyecto(proyecto.getIdProyecto());
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream()
                .filter(tarea -> "completada".equals(tarea.getEstado()))
                .count();

        Double progreso = totalTasks > 0 ? (double) completedTasks / totalTasks * 100.0 : 0.0;

        return new ProyectoResponse(
                proyecto.getIdProyecto(),
                proyecto.getNombre(),
                proyecto.getDescripcion(),
                proyecto.getEstado(),
                colaboradores,
                progreso, // Pass progress to the constructor
                proyecto.getAdmin().getId()
        );
    }

    // Métodos para Colaboradores

    public List<ColaboradorResponse> getColaboradores(Long proyectoId) {
        return proyectoUsuarioRepository.findByProyectoIdProyecto(proyectoId).stream()
                .map(pu -> new ColaboradorResponse(
                        pu.getUsuario().getId(),
                        pu.getUsuario().getUsername(),
                        pu.getUsuario().getEmail(),
                        pu.getRolEnProyecto(),
                        pu.getEstadoInvitacion()
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
        nuevoColaborador.setEstadoInvitacion("pendiente");
        proyectoUsuarioRepository.save(nuevoColaborador);

        // Crear y enviar notificación de invitación
        String mensaje = String.format("Has sido invitado al proyecto '%s' como %s.", proyecto.getNombre(), request.getRol());
        Notificacion notificacion = new Notificacion(null, mensaje, "invitacion_proyecto", false, usuarioAAgregar, null, proyecto);
        Notificacion savedNotificacion = notificacionService.create(notificacion);
        messagingTemplate.convertAndSendToUser(usuarioAAgregar.getUsername(), "/topic/notifications", notificacionMapper.toNotificacionResponse(savedNotificacion));

        return new ColaboradorResponse(
                usuarioAAgregar.getId(),
                usuarioAAgregar.getUsername(),
                usuarioAAgregar.getEmail(),
                request.getRol(),
                "pendiente"
        );
    }

    @Transactional
    public void responderInvitacion(Long proyectoId, String respuesta) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
        Proyecto_usuario proyectoUsuario = proyectoUsuarioRepository
            .findByProyectoIdProyectoAndUsuarioId(proyectoId, user.getId())
            .orElseThrow(() -> new RuntimeException("No se encontró la invitación al proyecto."));
    
        if (!"pendiente".equals(proyectoUsuario.getEstadoInvitacion())) {
            throw new RuntimeException("Ya has respondido a esta invitación.");
        }
    
        String mensajeNotificacionAdmin;
        if ("aceptado".equals(respuesta)) {
            proyectoUsuario.setEstadoInvitacion("aceptado");
            mensajeNotificacionAdmin = String.format("%s ha aceptado la invitación al proyecto '%s'.", user.getUsername(), proyectoUsuario.getProyecto().getNombre());
        } else if ("rechazado".equals(respuesta)) {
            proyectoUsuario.setEstadoInvitacion("rechazado");
            mensajeNotificacionAdmin = String.format("%s ha rechazado la invitación al proyecto '%s'.", user.getUsername(), proyectoUsuario.getProyecto().getNombre());
            // Opcional: eliminar el registro si es rechazado
            // proyectoUsuarioRepository.delete(proyectoUsuario);
        } else {
            throw new RuntimeException("Respuesta no válida. Use 'aceptado' or 'rechazado'.");
        }
        
        proyectoUsuarioRepository.save(proyectoUsuario);
    
        // Notificar al admin del proyecto
        User admin = proyectoUsuario.getProyecto().getAdmin();
        Notificacion notificacionParaAdmin = new Notificacion(null, mensajeNotificacionAdmin, "respuesta_invitacion", false, admin, null, proyectoUsuario.getProyecto());
        Notificacion savedNotificacion = notificacionService.create(notificacionParaAdmin);
        messagingTemplate.convertAndSendToUser(admin.getUsername(), "/topic/notifications", notificacionMapper.toNotificacionResponse(savedNotificacion));
    }

    @Transactional
    public void updateColaboradorRol(Long proyectoId, Long usuarioId, String rol) throws AccessDeniedException {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        // Auth check
        checkIsAdmin(proyecto);

        Proyecto_usuario proyectoUsuario = proyectoUsuarioRepository.findByProyectoIdProyectoAndUsuarioId(proyectoId, usuarioId)
                .orElseThrow(() -> new RuntimeException("Colaborador no encontrado."));

        proyectoUsuario.setRolEnProyecto(rol);
        proyectoUsuarioRepository.save(proyectoUsuario);

        // Notify user of role change
        String mensaje = String.format("Tu rol en el proyecto '%s' ha sido cambiado a %s.", proyecto.getNombre(), rol);
        Notificacion notificacion = new Notificacion(null, mensaje, "rol_actualizado", false, proyectoUsuario.getUsuario(), null, proyecto);
        Notificacion savedNotificacion = notificacionService.create(notificacion);
        messagingTemplate.convertAndSendToUser(proyectoUsuario.getUsuario().getUsername(), "/topic/notifications", notificacionMapper.toNotificacionResponse(savedNotificacion));
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

        // Crear y enviar notificación
        String mensaje = String.format("Has sido eliminado del proyecto '%s'.", proyecto.getNombre());
        Notificacion notificacion = new Notificacion(null, mensaje, "colaborador", false, usuarioAEliminar, null, proyecto);
        Notificacion savedNotificacion = notificacionService.create(notificacion);
        messagingTemplate.convertAndSendToUser(usuarioAEliminar.getUsername(), "/topic/notifications", notificacionMapper.toNotificacionResponse(savedNotificacion));
    }
    
    private void checkIsAdmin(Proyecto proyecto) throws AccessDeniedException {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        if (!proyecto.getAdmin().getUsername().equals(username)) {
            throw new AccessDeniedException("Solo el administrador del proyecto puede realizar esta acción.");
        }
    }
}
