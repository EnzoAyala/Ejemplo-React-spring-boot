package com.aprender.backend.web.controller;

import com.aprender.backend.domain.repository.ProyectoRepository;
import com.aprender.backend.persistence.entity.Proyecto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProyectoController {

    @Autowired
    private ProyectoRepository proyectoRepository;

    // Obtener proyectos por usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Proyecto> obtenerProyectosUsuario(@PathVariable Long usuarioId) {
        return proyectoRepository.findByUsuarioId(usuarioId);
    }

    // 🔹 NUEVO: Obtener un proyecto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Proyecto> obtenerProyectoPorId(@PathVariable Long id) {
        Optional<Proyecto> proyecto = proyectoRepository.findById(id);
        return proyecto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear proyecto
    @PostMapping
    public Proyecto crearProyecto(@RequestBody Proyecto proyecto) {
        return proyectoRepository.save(proyecto);
    }

    // 🔹 NUEVO: Actualizar proyecto completo
    @PutMapping("/{id}")
    public ResponseEntity<Proyecto> actualizarProyecto(@PathVariable Long id, @RequestBody Proyecto proyectoData) {
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(id);

        if (proyectoOpt.isPresent()) {
            Proyecto proyecto = proyectoOpt.get();
            proyecto.setNombre(proyectoData.getNombre());
            proyecto.setDescripcion(proyectoData.getDescripcion());
            proyecto.setEstado(proyectoData.getEstado());

            Proyecto proyectoActualizado = proyectoRepository.save(proyecto);
            return ResponseEntity.ok(proyectoActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    // 🔹 NUEVO: Eliminar proyecto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProyecto(@PathVariable Long id) {
        if (proyectoRepository.existsById(id)) {
            proyectoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Cambiar estado del proyecto (Drag & Drop)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Proyecto> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(id);

        if (proyectoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Proyecto proyecto = proyectoOpt.get();
        proyecto.setEstado(nuevoEstado);
        proyectoRepository.save(proyecto);

        return ResponseEntity.ok(proyecto);
    }
}