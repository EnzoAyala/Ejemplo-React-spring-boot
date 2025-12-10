# Etapa 1: Build con Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -e -X -DskipTests clean package

# Etapa 2: Ejecutar la app
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Render expone el puerto 8080
EXPOSE 8080

# Variable obligatoria para Render
ENV PORT=8080

ENTRYPOINT ["java", "-jar", "app.jar"]
