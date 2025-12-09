package com.aprender.backend.domain.mappers;

import com.aprender.backend.domain.dto.response.ComentarioResponse;
import com.aprender.backend.persistence.entity.Comentario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class ComentarioMapper {

    @Autowired
    private UserMapper userMapper;

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public ComentarioResponse toComentarioResponse(Comentario c) {
        if (c == null) return null;
        return new ComentarioResponse(
                c.getIdComentario(),
                c.getContenido(),
                c.getFecha() != null ? c.getFecha().format(ISO) : null,
                userMapper.toUserResponseUser(c.getUsuario()),
                c.getArchivoNombre()
        );
    }
}
