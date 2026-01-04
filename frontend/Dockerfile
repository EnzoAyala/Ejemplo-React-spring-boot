# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de servicio
FROM nginx:stable-alpine

# Copiar los archivos generados desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# El comando por defecto de nginx se encargará de servir los archivos
CMD ["nginx", "-g", "daemon off;"]
