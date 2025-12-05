
package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.response.NotificacionResponse;
import com.aprender.backend.domain.mappers.NotificacionMapper;
import com.aprender.backend.domain.services.NotificacionService;
import com.aprender.backend.persistence.entity.Notificacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notificaciones/")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private NotificacionMapper notificacionMapper;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificacionResponse>> getNotificationsByUserId(@PathVariable Long userId) {
        List<Notificacion> notificaciones = notificacionService.getByUserId(userId);
        List<NotificacionResponse> notificacionResponses = notificaciones.stream()
                .map(notificacionMapper::toNotificacionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificacionResponses);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificacionResponse>> getUnreadNotificationsByUserId(@PathVariable Long userId) {
        List<Notificacion> notificaciones = notificacionService.getUnreadByUserId(userId);
        List<NotificacionResponse> notificacionResponses = notificaciones.stream()
                .map(notificacionMapper::toNotificacionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificacionResponses);
    }

    @PostMapping("/{notificacionId}/mark-as-read")
    public ResponseEntity<NotificacionResponse> markAsRead(@PathVariable Integer notificacionId) {
        Notificacion notificacion = notificacionService.markAsRead(notificacionId);
        return ResponseEntity.ok(notificacionMapper.toNotificacionResponse(notificacion));
    }
}
