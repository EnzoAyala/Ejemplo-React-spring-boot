import axios from 'axios';
import AuthService from './auth.service';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/', // URL base para tus endpoints protegidos
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptador de solicitudes: se ejecuta antes de que se envie cada solicitud
instance.interceptors.request.use (
    (config) => {
        const user = AuthService.getCurrentUser(); // Optiene el usuario del almacenamiento local

        if (user && user.token) {
            // Si hay un token, lo agrega al encabezado de autorizacion
            // El formatio debe ser "Bearer TU_TOKEN_JWT"
            config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        return config; // Retorna la configuracion de la solicitudd modificada
    },
    (error) => {
        return Promise.reject(error); // Si ocurre algún error, lo retorna
    }
);

// Interceptor de respuestas para manejo global de errores de JWT, ej. toke expirado
instance.interceptors.response.use(
    (response) => {
        return response; // Retorna la respuesta original
    },
    (error) => {
        // Si el error es un 401, lo redirige a la página de login
        if (error.response.status === 401) {
            console.log('Token expirado, redirigiendo a la página de login'); // Debug
            AuthService.logout(); // Elimina el token del almacenamiento local
            window.location.reload('/login'); // Redirige a la página de login
        }
        return Promise.reject(error); // Si ocurre algún error, lo retorna
    }
);

export default instance;