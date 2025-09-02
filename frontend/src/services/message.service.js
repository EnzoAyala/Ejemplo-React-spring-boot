import api from './api';

const BASE = 'messages';

const MessageService = {
  // Trae la conversación (mensajes descifrados) entre dos usuarios
  getConversation(user1, user2) {
    return api.get(`${BASE}/conversation`, { params: { user1, user2 } });
  },

  // Envía un mensaje (el backend cifra y guarda)
  sendMessage({ emisorId, receptorId, contenido, chatId }) {
    return api.post(`${BASE}`, { emisorId, receptorId, contenido, chatId });
  },

  // Marca como leídos los mensajes donde 'receptor' sea el usuario indicado
  markAsRead(user1, user2, receptor) {
    return api.post(`${BASE}/mark-read`, null, { params: { user1, user2, receptor } });
  }
};

export default MessageService;
