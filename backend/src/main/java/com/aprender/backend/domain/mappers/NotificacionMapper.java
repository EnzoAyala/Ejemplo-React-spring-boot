package com.aprender.backend.domain.mappers;

import com.aprender.backend.domain.dto.response.NotificacionResponse;
import com.aprender.backend.domain.dto.response.TareaResponse;
import com.aprender.backend.persistence.entity.Notificacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificacionMapper {

    @Autowired
    private ProyectoMapper proyectoMapper;

    // TareaMapper would be needed if we want to map Tarea to TareaResponse
    // @Autowired
    // private TareaMapper tareaMapper;

    public NotificacionResponse toNotificacionResponse(Notificacion notificacion) {
        if (notificacion == null) {
            return null;
        }

        TareaResponse tareaResponse = null;
        // if (notificacion.getTarea() != null) {
        //     tareaResponse = tareaMapper.toTareaResponse(notificacion.getTarea());
        // }

        return new NotificacionResponse(
                notificacion.getIdNotificacion(),
                notificacion.getMensaje(),
                notificacion.getTipo(),
                notificacion.getLeida(),
                notificacion.getUsuario() != null ? notificacion.getUsuario().getId() : null,
                tareaResponse,
                notificacion.getProyecto() != null ? proyectoMapper.toProyectoResponse(notificacion.getProyecto()) : null
        );
    }
}
