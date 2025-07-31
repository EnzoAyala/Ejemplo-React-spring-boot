import axios from 'axios';

// URL base para autenticación
const API_URL = 'http://192.168.1.2:8080/api/auth/';

class AuthService {
  // Login: envía username y password y guarda el token si es correcto
  login(username, password) {
    return axios.post(API_URL + 'signin', { username, password })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  // Logout: elimina usuario local y notifica backend para invalidar token
  logout() {
    axios.post(API_URL + 'signout', {}, { headers: this.getAuthHeader() });
    localStorage.removeItem('user');
  }

  // Registro de nuevo usuario
  register(name, lastname, dni, username, email, phone, password) {
    return axios.post(API_URL + 'signup', {
      name, lastname, dni, username, email, phone, password
    });
  }

  // Obtiene usuario actual guardado en localStorage
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }

  // Construye header Authorization con token JWT si existe
  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.accessToken };
    }
    return {};
  }

  // Verifica si el usuario tiene rol ADMIN
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('ROLE_ADMIN');
  }

  // Verifica si el usuario tiene rol USER
  isUser() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('ROLE_USER');
  }
}

export default new AuthService();
