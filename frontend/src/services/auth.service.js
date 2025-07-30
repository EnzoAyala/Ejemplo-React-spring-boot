import axios from 'axios'; // Importa la librería Axios para hacer peticiones HTTP

// Define la URL base de tu API de Spring Boot para autenticación
const API_URL = 'http://192.168.1.2:8080/api/auth/';
const API_ADMIN_URL = 'http://192.168.1.2:8080/api/admin/'; // URL para el admin


// Clase de servicio para encapsular la lógica de autenticación (login, logout, registro)
class AuthService {
  // Método para iniciar sesión de un usuario
  login(username, password) {
    // Realiza una petición POST a la URL de login con el nombre de usuario y la contraseña
    return axios.post(API_URL + 'signin', {
      username,
      password
    })
      .then(response => {
        // Si el login es exitoso y el backend devuelve un token 
        if (response.data.accessToken) {
          // Guarda la información completa del usuario (incluyendo el token) en el almacenamiento local del navegador
          // Esto permite mantener la sesión del usuario entre recargas de página
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data; // Devuelve los datos de la respuesta (incluyendo el token JWT)
      });
  }

  // Método para cerrar la sesión del usuario
  logout() {
    // 1. (Opcional pero recomendado) Notificar al backend para invalidar el token.
    //    Esto requiere que implementes un endpoint /api/auth/signout en Spring Boot.
    //    Este endpoint debería añadir el token a una "lista negra" (blacklist).
    //    La llamada se puede hacer y no esperar la respuesta para que la UI sea rápida.
    axios.post(API_URL + 'signout', {}, { headers: this.getAuthHeader() });

    // 2. Elimina la información del usuario del almacenamiento local para invalidar la sesión en el frontend.
    //    Esto se ejecuta inmediatamente, cerrando la sesión en la UI.
    localStorage.removeItem('user');
  }

  // Método para registrar un nuevo usuario
  register(name, lastname, dni, username, email, phone, password) {
    // Realiza una petición POST a la URL de registro con todos los datos del nuevo usuario
    return axios.post(API_URL + 'signup', {
      name,
      lastname,
      dni,
      username,
      email,
      phone,
      password,
      // roles: ["user"] // Opcional: el backend ya asigna "ROLE_USER" por defecto
    });
  }

  // Método para obtener la información del usuario actual desde el almacenamiento local
  getCurrentUser() {
    // Intenta parsear la cadena JSON almacenada como 'user' a un objeto JavaScript
    // Si no hay nada, JSON.parse(null) o JSON.parse(undefined) puede fallar, por eso se maneja
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return null; // Retorna null si hay un error de parseo o el item no existe
    }
  }

  // Helper para obtener el header de autorizacion con el token JWT
  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.accessToken }
    } else {
      return {};
    }
  }

  // Metodo para verificar si el usuario actual es un administrador
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.includes('ROLE_ADMIN');
  }

  // Metodo para verificar si el usuario actual es un usuario regular
  isUser() {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.includes('ROLE_USER');
  }

  // Métodos para los endpoints de administrador (AdminController)
  getAllUsersForAdmin() {
    return axios.get(API_ADMIN_URL + 'users', { headers: this.getAuthHeader() });
  }

  updateUserRoles(userId, roles) {
    // 'roles' debe ser un array de strings, ej. ['USER'], ['ADMIN'], ['USER', 'ADMIN']
    return axios.put(API_ADMIN_URL + 'users/roles', { userId, roles }, { headers: this.getAuthHeader() });
  }

}

export default new AuthService();