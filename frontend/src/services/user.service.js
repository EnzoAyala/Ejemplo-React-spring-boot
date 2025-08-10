import api from './api';
import authService from './auth.service';

const USER_BASE = 'user/';

const UserService = {

  // Obtener todos los usuarios
  getAllUsers() {
    return api.get(USER_BASE + 'users', { headers: authService.getAuthHeader() });
  },

};

export default UserService;
