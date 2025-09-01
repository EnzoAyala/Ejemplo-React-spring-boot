import api from './api';

const USER_BASE = 'user/';

const UserService = {

  // Obtener todos los usuarios
  getAllUsers() {
    return api.get(USER_BASE + 'users');
  },

  // Actualizar el perfil del usuario (JSON o FormData)
  updateUserProfile(id, profileData) {
    // Usar axios + interceptor: Authorization se añade automáticamente y el Content-Type se resuelve según el cuerpo
    return api.put(USER_BASE + id, profileData);
  },

  changePassword(id, passwordData) {
    return api.put(USER_BASE + id + '/change-password', passwordData);
  }

};

export default UserService;
