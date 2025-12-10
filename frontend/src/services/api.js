import axios from 'axios';
import AuthService from './auth.service';
import { Navigate } from 'react-router-dom';

// Instancia axios con configuración base para todas las peticiones
const instance = axios.create({
    baseURL: `https://worksyncback.onrender.com/api/`, // URL base dinámica
});

// Interceptor para agregar token JWT a cada petición si existe
instance.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser(); // Obtener usuario actual con token
        if (user && user.accessToken) {
            config.headers['Authorization'] = 'Bearer ' + user.accessToken; // Agregar token al header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejo global de errores en respuestas, ej. token expirado
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Token expirado, redirigiendo a login');
            // AuthService.logout(); // Eliminar token y redireccionar a login
            // window.location.href = '/error_autentificacion';
            return Promise.reject(new Error('Token expirado'));
        }
        return Promise.reject(error);
    }
);

export default instance;
