package com.aprender.backend.web.controller;

import com.aprender.backend.domain.repository.TareaRepository;
import com.aprender.backend.domain.repository.ProyectoRepository;
import com.aprender.backend.domain.repository.UserRepository;
import com.aprender.backend.persistence.entity.Tarea;
import com.aprender.backend.persistence.entity.Proyecto;
import com.aprender.backend.persistence.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "http://localhost:5173")
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private UserRepository userRepository;

    // Obtener todas las tareas
    @GetMapping
    public List<Tarea> obtenerTodasTareas() {
        return tareaRepository.findAll();
    }

    // Obtener tareas por proyecto
    @GetMapping("/proyecto/{proyectoId}")
    public List<Tarea> obtenerTareasPorProyecto(@PathVariable Long proyectoId) {
        return tareaRepository.findByProyectoId(proyectoId);
    }

    // Obtener tareas por responsable
    @GetMapping("/responsable/{responsableId}")
    public List<Tarea> obtenerTareasPorResponsable(@PathVariable Long responsableId) {
        return tareaRepository.findByResponsableId(responsableId);
    }

    // Obtener una tarea por ID
    @GetMapping("/{id}")
    public ResponseEntity<Tarea> obtenerTareaPorId(@PathVariable Long id) {
        Optional<Tarea> tarea = tareaRepository.findById(id);
        return tarea.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear nueva tarea
    @PostMapping
    public ResponseEntity<Tarea> crearTarea(@RequestBody TareaRequest tareaRequest) {
        try {
            Tarea tarea = new Tarea();
            tarea.setTitulo(tareaRequest.getTitulo());
            tarea.setDescripcion(tareaRequest.getDescripcion());
            tarea.setEstado(tareaRequest.getEstado() != null ? tareaRequest.getEstado() : "pendiente");
            tarea.setFechaEntrega(tareaRequest.getFechaEntrega());
            tarea.setPrioridad(tareaRequest.getPrioridad() != null ? tareaRequest.getPrioridad() : "media");

            // Asociar proyecto
            if (tareaRequest.getIdProyecto() != null) {
                Optional<Proyecto> proyecto = proyectoRepository.findById(tareaRequest.getIdProyecto());
                proyecto.ifPresent(tarea::setProyecto);
            }

            // Asociar responsable
            if (tareaRequest.getIdResponsable() != null) {
                Optional<User> responsable = userRepository.findById(tareaRequest.getIdResponsable());
                responsable.ifPresent(tarea::setResponsable);
            }

            Tarea tareaGuardada = tareaRepository.save(tarea);
            return ResponseEntity.ok(tareaGuardada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Actualizar tarea
    @PutMapping("/{id}")
    public ResponseEntity<Tarea> actualizarTarea(@PathVariable Long id, @RequestBody TareaRequest tareaRequest) {
        Optional<Tarea> tareaOpt = tareaRepository.findById(id);

        if (tareaOpt.isPresent()) {
            Tarea tarea = tareaOpt.get();
            tarea.setTitulo(tareaRequest.getTitulo());
            tarea.setDescripcion(tareaRequest.getDescripcion());
            tarea.setEstado(tareaRequest.getEstado());
            tarea.setFechaEntrega(tareaRequest.getFechaEntrega());
            tarea.setPrioridad(tareaRequest.getPrioridad());

            // Actualizar proyecto si se proporciona
            if (tareaRequest.getIdProyecto() != null) {
                Optional<Proyecto> proyecto = proyectoRepository.findById(tareaRequest.getIdProyecto());
                proyecto.ifPresent(tarea::setProyecto);
            }

            // Actualizar responsable si se proporciona
            if (tareaRequest.getIdResponsable() != null) {
                Optional<User> responsable = userRepository.findById(tareaRequest.getIdResponsable());
                responsable.ifPresent(tarea::setResponsable);
            }

            Tarea tareaActualizada = tareaRepository.save(tarea);
            return ResponseEntity.ok(tareaActualizada);
        }

        return ResponseEntity.notFound().build();
    }

    // Eliminar tarea
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        if (tareaRepository.existsById(id)) {
            tareaRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Cambiar estado de tarea (útil para drag & drop)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Tarea> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        Optional<Tarea> tareaOpt = tareaRepository.findById(id);

        if (tareaOpt.isPresent()) {
            Tarea tarea = tareaOpt.get();
            tarea.setEstado(nuevoEstado);
            Tarea tareaActualizada = tareaRepository.save(tarea);
            return ResponseEntity.ok(tareaActualizada);
        }

        return ResponseEntity.notFound().build();
    }

    // Clase auxiliar para Request Body
    public static class TareaRequest {
        private String titulo;
        private String descripcion;
        private String estado;
        private java.sql.Date fechaEntrega;
        private String prioridad;
        private Long idProyecto;
        private Long idResponsable;

        // Getters y Setters
        public String getTitulo() { return titulo; }
        public void setTitulo(String titulo) { this.titulo = titulo; }

        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }

        public java.sql.Date getFechaEntrega() { return fechaEntrega; }
        public void setFechaEntrega(java.sql.Date fechaEntrega) { this.fechaEntrega = fechaEntrega; }

        public String getPrioridad() { return prioridad; }
        public void setPrioridad(String prioridad) { this.prioridad = prioridad; }

        public Long getIdProyecto() { return idProyecto; }
        public void setIdProyecto(Long idProyecto) { this.idProyecto = idProyecto; }

        public Long getIdResponsable() { return idResponsable; }
        public void setIdResponsable(Long idResponsable) { this.idResponsable = idResponsable; }
    }
}

