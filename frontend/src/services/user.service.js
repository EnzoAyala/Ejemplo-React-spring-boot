// frontend/src/services/user.service.js (Ejemplo si lo mantienes separado)

import axios from 'axios';
import AuthService from './auth.service'; // Importa el AuthService completo

const API_BASE_URL = 'http://192.168.1.2:8080/api/';

const UserService = {
  // Función para obtener contenido público
  getPublicContent: () => {
    return axios.get(API_BASE_URL + 'test/all');
  },

  // Función para obtener contenido de usuario
  getUserBoard: () => {
    return axios.get(API_BASE_URL + 'test/user', { headers: AuthService.getAuthHeader() });
  },

  // Función para obtener contenido de administrador
  getAdminBoard: () => {
    return axios.get(API_BASE_URL + 'test/admin', { headers: AuthService.getAuthHeader() });
  },

  // Función para que el administrador obtenga todos los usuarios
  getAllUsers: () => {
    return axios.get(API_BASE_URL + 'admin/users', { headers: AuthService.getAuthHeader() });
  },

  // Función para que el administrador actualice los roles de un usuario
  updateUserRoles: (userId, roles) => {
    return axios.put(API_BASE_URL + 'admin/users/roles', { userId, roles }, { headers: AuthService.getAuthHeader() });
  }
};

export default UserService;