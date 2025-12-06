
package com.aprender.backend.domain.services;

import com.aprender.backend.domain.repository.NotificacionRepository;
import com.aprender.backend.persistence.entity.Notificacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    public Notificacion create(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }

    public List<Notificacion> getByUserId(Long userId) {
        return notificacionRepository.findByUsuario_Id(userId);
    }

    public List<Notificacion> getUnreadByUserId(Long userId) {
        return notificacionRepository.findByUsuario_IdAndLeida(userId, false);
    }

    public Notificacion markAsRead(Integer notificacionId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new RuntimeException("Notificacion no encontrada"));
        notificacion.setLeida(true);
        return notificacionRepository.save(notificacion);
    }

    public void deleteByProyectoId(Long proyectoId) {
        notificacionRepository.deleteByProyecto_IdProyecto(proyectoId);
    }
}
