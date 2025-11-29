package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.request.ProyectoRequest;
import com.aprender.backend.domain.dto.response.ProyectoResponse;
import com.aprender.backend.domain.services.ProyectoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proyectos/")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    @GetMapping
    public ResponseEntity<List<ProyectoResponse>> getAllProyectos() {
        return ResponseEntity.ok(proyectoService.getAllProyectos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoResponse> getProyectoById(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.getProyectoById(id));
    }

    @PostMapping("/nuevo")
    public ResponseEntity<ProyectoResponse> createProyecto(@RequestBody ProyectoRequest proyectoRequest) {
        return ResponseEntity.ok(proyectoService.createProyecto(proyectoRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoResponse> updateProyecto(@PathVariable Long id, @RequestBody ProyectoRequest proyectoRequest) {
        return ResponseEntity.ok(proyectoService.updateProyecto(id, proyectoRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProyecto(@PathVariable Long id) {
        proyectoService.deleteProyecto(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<ProyectoResponse> updateEstado(@PathVariable Long id, @RequestBody Map<String, String> estadoRequest) {
        String estado = estadoRequest.get("estado");
        return ResponseEntity.ok(proyectoService.updateEstado(id, estado));
    }
}
