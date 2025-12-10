# --- ETAPA 1: Construcción con Maven ---
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar pom y descargar dependencias (cache)
COPY pom.xml .
RUN mvn -q dependency:resolve

# Copiar el resto del código
COPY src ./src

# Empaquetar la aplicación
RUN mvn -q clean package -DskipTests


# --- ETAPA 2: Imagen final con Java 21 ---
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copiar el JAR generado
COPY --from=build /app/target/*.jar app.jar

# Puerto en Render
EXPOSE 8080

# Comando de arranque
ENTRYPOINT ["java", "-jar", "app.jar"]
