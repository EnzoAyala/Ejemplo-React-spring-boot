package com.aprender.backend.domain.mappers;

import com.aprender.backend.domain.dto.response.ArchivoResponse;
import com.aprender.backend.persistence.entity.Archivo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ArchivoMapper {

    @Mapping(source = "idArchivo", target = "id")
    @Mapping(source = "nombre", target = "nombre")
    @Mapping(source = "tipo", target = "tipo")
    @Mapping(source = "url", target = "url")
    ArchivoResponse toArchivoResponse(Archivo archivo);
}
