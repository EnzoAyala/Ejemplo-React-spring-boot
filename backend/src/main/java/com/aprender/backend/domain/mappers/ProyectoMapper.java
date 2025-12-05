package com.aprender.backend.domain.mappers;

import com.aprender.backend.domain.dto.response.ProyectoResponse;
import com.aprender.backend.persistence.entity.Proyecto;
import org.springframework.stereotype.Component;



@Component
public class ProyectoMapper {

    public ProyectoResponse toProyectoResponse(Proyecto proyecto) {
        if (proyecto == null) {
            return null;
        }
        return new ProyectoResponse(
                proyecto.getIdProyecto(),
                proyecto.getNombre(),
                proyecto.getDescripcion(),
                proyecto.getEstado(),
                null, // Colaboradores se llena en el servicio
                0.0, // Progreso se llena en el servicio
                proyecto.getAdmin() != null ? proyecto.getAdmin().getId() : null
        );
    }
}
