package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.request.TareaRequest;
import com.aprender.backend.domain.dto.response.TareaResponse;
import com.aprender.backend.domain.services.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tarea/")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @GetMapping("/proyecto/{proyectoId}")
    public ResponseEntity<List<TareaResponse>> getTareasByProyectoId(@PathVariable Long proyectoId) {
        return ResponseEntity.ok(tareaService.getTareasByProyectoId(proyectoId));
    }

    @PostMapping("/nuevo") // Crear nueva tarea
    public ResponseEntity<TareaResponse> createTarea(@RequestBody TareaRequest tareaRequest) {
        return ResponseEntity.ok(tareaService.createTarea(tareaRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TareaResponse> updateTarea(@PathVariable Long id, @RequestBody TareaRequest tareaRequest) {
        return ResponseEntity.ok(tareaService.updateTarea(id, tareaRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTarea(@PathVariable Long id) {
        tareaService.deleteTarea(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<TareaResponse> updateEstado(@PathVariable Long id, @RequestBody Map<String, String> estadoRequest) {
        String estado = estadoRequest.get("estado");
        return ResponseEntity.ok(tareaService.updateEstado(id, estado));
    }
}
