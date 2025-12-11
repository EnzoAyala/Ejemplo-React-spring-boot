import axios from 'axios';

// URL base para autenticación (dinámica según el host del frontend)
const API_URL = `http://localhost:8080/api/auth/`;

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
  register(name, lastname, dni, username, email, phone, password, gender) {
    return axios.post(API_URL + 'signup', {
      name, lastname, dni, username, email, phone, password, gender
    });
  }

  // Recuperar contraseña
  forgotPassword(data) {
    return axios.post(API_URL + 'forgot-password', data);
  }

  // Validar código de restablecimiento de contraseña
  validateResetCode(data) {
    return axios.post(API_URL + 'validate-reset-code', data);
  }

  // Restablecer contraseña
  resetPassword(data) {
    return axios.post(API_URL + 'reset-password', data);
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

}



export const getAuthToken = () => {

  try {

    const user = JSON.parse(localStorage.getItem('user'));

    return user?.accessToken || null;

  } catch {

    return null;

  }

};



export default new AuthService();
