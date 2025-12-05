
package com.aprender.backend.web.controller;

import com.aprender.backend.domain.services.NotificacionService;
import com.aprender.backend.persistence.entity.Notificacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones/")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notificacion>> getNotificationsByUserId(@PathVariable Long userId) {
        List<Notificacion> notificaciones = notificacionService.getByUserId(userId);
        return ResponseEntity.ok(notificaciones);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notificacion>> getUnreadNotificationsByUserId(@PathVariable Long userId) {
        List<Notificacion> notificaciones = notificacionService.getUnreadByUserId(userId);
        return ResponseEntity.ok(notificaciones);
    }

    @PostMapping("/{notificacionId}/mark-as-read")
    public ResponseEntity<Notificacion> markAsRead(@PathVariable Integer notificacionId) {
        Notificacion notificacion = notificacionService.markAsRead(notificacionId);
        return ResponseEntity.ok(notificacion);
    }
}
