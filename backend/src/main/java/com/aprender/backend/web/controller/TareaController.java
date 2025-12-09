package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.request.ComentarioRequest;
import com.aprender.backend.domain.dto.response.ComentarioResponse;
import com.aprender.backend.domain.dto.request.TareaRequest;
import com.aprender.backend.domain.dto.response.TareaResponse;
import com.aprender.backend.domain.services.FileStorageService;
import com.aprender.backend.domain.services.TareaService;
import com.aprender.backend.persistence.entity.Archivo;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tarea/")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @Autowired
    private FileStorageService fileStorageService;

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

    // Comentarios
    @GetMapping("/{id}/comentarios")
    public ResponseEntity<List<ComentarioResponse>> getComentarios(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.getComentarios(id));
    }

    @PostMapping(value = "/{id}/comentarios", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ComentarioResponse> addComentario(
            @PathVariable Long id,
            @RequestPart("comentario") ComentarioRequest request,
            @RequestPart(name = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(tareaService.addComentario(id, request, file));
    }

    @PostMapping("/{id}/archivos")
    public ResponseEntity<Archivo> uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        return ResponseEntity.ok(tareaService.storeFile(id, file));
    }

    @GetMapping("/{id}/archivos")
    public ResponseEntity<List<Archivo>> getFiles(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.getFiles(id));
    }

    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(filename);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // fallback to the default content type if type could not be determined
        }

        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
