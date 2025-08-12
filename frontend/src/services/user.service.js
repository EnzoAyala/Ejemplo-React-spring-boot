import api from './api';
import authService from './auth.service';

const USER_BASE = 'user/';

const UserService = {

  // Obtener todos los usuarios
  getAllUsers() {
    return api.get(USER_BASE + 'users', { headers: authService.getAuthHeader() });
  },

  // Actualizar el perfil del usuario
  updateUserProfile(id, formData) {
    return api.put(USER_BASE + id, formData, {
      headers: {
        ...authService.getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  changePassword(id, passwordData) {
    return api.put(USER_BASE + id + '/change-password', passwordData, { headers: authService.getAuthHeader() });
  }

};

export default UserService;
