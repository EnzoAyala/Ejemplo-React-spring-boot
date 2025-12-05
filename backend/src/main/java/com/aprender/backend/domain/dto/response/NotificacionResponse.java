package com.aprender.backend.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionResponse {
    private Integer idNotificacion;
    private String mensaje;
    private String tipo;
    private boolean leida;
    private Long idUsuario;
    private TareaResponse tarea;
    private ProyectoResponse proyecto;
}
