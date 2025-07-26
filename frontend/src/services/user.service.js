import api from './api'; // Importa la instancia de Axios con el interceptor de JWT

// Define la sub-URL para los endpoints de prueba en el backend
// Tus endpoints de prueba en Spring Boot están mapeados bajo /api/test/
const API_URL = 'test/';

// Clase de servicio para interactuar con los endpoints de usuario y administrador
class UserService {
    // Método para obtener contenido público (accesible para todos sin autenticación)
    getPublicContent() {
        // Hace una petición GET a /api/test/all
        return api.get(API_URL + 'all');
    }

    // Método para obtener contenido restringido para usuarios (requiere ROLE_USER o ROLE_ADMIN)
    getUserBoard() {
        // Hace una petición GET a /api/test/user
        return api.get(API_URL + 'user');
    }

    // Método para obtener contenido restringido para administradores (requiere ROLE_ADMIN)
    getAdminBoard() {
        // Hace una petición GET a /api/test/admin
        return api.get(API_URL + 'admin');
    }
}

// Exporta una instancia de la clase UserService
export default new UserService();