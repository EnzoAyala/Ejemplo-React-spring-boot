package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.request.ColaboradorRequest;
import com.aprender.backend.domain.dto.request.ProyectoRequest;
import com.aprender.backend.domain.dto.response.ColaboradorResponse;
import com.aprender.backend.domain.dto.response.ProyectoResponse;
import com.aprender.backend.domain.services.ProyectoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proyectos/")
@PreAuthorize("hasAnyRole('PLAN_GRATUITO', 'PLAN_CASUAL', 'PLAN_PREMIUM', 'ADMIN')")
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

    // Endpoints para Colaboradores

    @GetMapping("/{id}/colaboradores")
    public ResponseEntity<List<ColaboradorResponse>> getColaboradores(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.getColaboradores(id));
    }

    @PostMapping("/{id}/colaboradores")
    public ResponseEntity<ColaboradorResponse> agregarColaborador(@PathVariable Long id, @RequestBody ColaboradorRequest request) throws AccessDeniedException {
        return ResponseEntity.status(HttpStatus.CREATED).body(proyectoService.agregarColaborador(id, request));
    }


    @DeleteMapping("/{id}/colaboradores/{usuarioId}")
    public ResponseEntity<Void> eliminarColaborador(@PathVariable Long id, @PathVariable Long usuarioId) throws AccessDeniedException {
        proyectoService.eliminarColaborador(id, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/invitacion")
    public ResponseEntity<Void> responderInvitacion(@PathVariable Long id, @RequestBody Map<String, String> respuestaRequest) {
        String respuesta = respuestaRequest.get("respuesta");
        proyectoService.responderInvitacion(id, respuesta);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/colaboradores/{usuarioId}")
    public ResponseEntity<Void> updateColaboradorRol(@PathVariable Long id, @PathVariable Long usuarioId, @RequestBody Map<String, String> rolRequest) throws AccessDeniedException {
        String rol = rolRequest.get("rol");
        proyectoService.updateColaboradorRol(id, usuarioId, rol);
        return ResponseEntity.ok().build();
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
