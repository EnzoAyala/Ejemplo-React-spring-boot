package com.aprender.backend.security.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio donde se almacenarán los archivos subidos.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        try {
            if(fileName.contains("..")) {
                throw new RuntimeException("¡Lo siento! El nombre de archivo contiene una secuencia de ruta no válida." + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("No se puede almacenar el archivo " + fileName + ". Por favor intenta de nuevo.", ex);
        }
    }
}
