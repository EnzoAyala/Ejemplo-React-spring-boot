import axios from 'axios'; // Importa la librería Axios para hacer peticiones HTTP

// Define la URL base de tu API de Spring Boot para autenticación
const API_URL = 'http://192.168.1.2:8080/api/auth/';

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
      if (response.data.token) {
        // Guarda la información completa del usuario (incluyendo el token) en el almacenamiento local del navegador
        // Esto permite mantener la sesión del usuario entre recargas de página
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data; // Devuelve los datos de la respuesta (incluyendo el token JWT)
    });
  }

  // Método para cerrar la sesión del usuario
  logout() {
    // Elimina la información del usuario del almacenamiento local, invalidando la sesión en el frontend
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
}

// Exporta una instancia de la clase AuthService para que pueda ser importada y utilizada en otros componentes
export default new AuthService();