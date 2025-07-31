import api from './api'
import authService from './auth.service';

// Base para endpoints admin
const ADMIN_BASE = 'admin/';

const AdminService = {
  // Obtener todos los usuarios (solo admin)
  getAllUsers() {
    return api.get(ADMIN_BASE + 'users', { headers: authService.getAuthHeader() });
  },

  // Actualizar roles de un usuario (solo admin)
  updateUserRoles(userId, roles) {
    return api.put(ADMIN_BASE + 'users/roles', { userId, roles }, { headers: authService.getAuthHeader() });
  },

  // Eliminar un usuario por id (solo admin)
  deleteUser(userId) {
    return api.delete(`${ADMIN_BASE}users/${userId}`, { headers: authService.getAuthHeader() });
  }
};

export default AdminService;
