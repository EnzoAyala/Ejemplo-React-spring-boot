import api from './api';

const NOTIFICACION_BASE = 'notificaciones/';

const NotificacionService = {

  getNotificationsByUserId(userId) {
    return api.get(NOTIFICACION_BASE + 'user/' + userId);
  },

  getUnreadNotificationsByUserId(userId) {
    return api.get(NOTIFICACION_BASE + 'user/' + userId + '/unread');
  },

  markAsRead(notificacionId) {
    return api.post(NOTIFICACION_BASE + notificacionId + '/mark-as-read');
  }
};

export default NotificacionService;
