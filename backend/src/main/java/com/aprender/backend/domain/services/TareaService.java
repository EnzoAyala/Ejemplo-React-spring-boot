package com.aprender.backend.domain.services;

import com.aprender.backend.domain.dto.request.TareaRequest;
import com.aprender.backend.domain.dto.response.TareaResponse;
import com.aprender.backend.domain.repository.ProyectoRepository;
import com.aprender.backend.domain.repository.TareaRepository;
import com.aprender.backend.persistence.entity.Proyecto;
import com.aprender.backend.persistence.entity.Tarea;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<TareaResponse> getTareasByProyectoId(Long proyectoId) {
        return tareaRepository.findByProyectoIdProyecto(proyectoId).stream()
                .map(this::mapToTareaResponse)
                .collect(Collectors.toList());
    }

    public TareaResponse createTarea(TareaRequest tareaRequest) {
        Proyecto proyecto = proyectoRepository.findById(tareaRequest.getProyectoId())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        Tarea tarea = new Tarea();
        tarea.setTitulo(tareaRequest.getTitulo());
        tarea.setDescripcion(tareaRequest.getDescripcion());
        if (tareaRequest.getFechaEntrega() != null && !tareaRequest.getFechaEntrega().isEmpty()) {
            tarea.setFechaEntrega(LocalDate.parse(tareaRequest.getFechaEntrega()));
        }
        tarea.setPrioridad(tareaRequest.getPrioridad());
        tarea.setEstado("pendiente"); // Default state
        tarea.setProyecto(proyecto);
        Tarea nuevaTarea = tareaRepository.save(tarea);
        return mapToTareaResponse(nuevaTarea);
    }

    public TareaResponse updateTarea(Long id, TareaRequest tareaRequest) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        tarea.setTitulo(tareaRequest.getTitulo());
        tarea.setDescripcion(tareaRequest.getDescripcion());
        if (tareaRequest.getFechaEntrega() != null && !tareaRequest.getFechaEntrega().isEmpty()) {
            tarea.setFechaEntrega(LocalDate.parse(tareaRequest.getFechaEntrega()));
        }
        tarea.setPrioridad(tareaRequest.getPrioridad());
        Tarea tareaActualizada = tareaRepository.save(tarea);
        return mapToTareaResponse(tareaActualizada);
    }

    public void deleteTarea(Long id) {
        tareaRepository.deleteById(id);
    }

    public TareaResponse updateEstado(Long id, String estado) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        tarea.setEstado(estado);
        Tarea tareaActualizada = tareaRepository.save(tarea);
        return mapToTareaResponse(tareaActualizada);
    }

    private TareaResponse mapToTareaResponse(Tarea tarea) {
        String fechaEntrega = tarea.getFechaEntrega() != null ? tarea.getFechaEntrega().toString() : null;
        return new TareaResponse(
                tarea.getIdTarea(),
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getEstado(),
                tarea.getPrioridad(),
                fechaEntrega
        );
    }
}