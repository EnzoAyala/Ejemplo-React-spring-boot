import axios from 'axios';
import AuthService from './auth.service';

// Instancia axios con configuración base para todas las peticiones
const instance = axios.create({
    baseURL: 'http://192.168.1.2:8080/api/', // URL base de la API
    headers: {
        'Content-Type': 'application/json',
    },
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
            AuthService.logout(); // Limpiar sesión local
            window.location.reload('/login'); // Redirigir a login
        }
        return Promise.reject(error);
    }
);

export default instance;
