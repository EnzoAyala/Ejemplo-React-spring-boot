import api from './api';

const TAREA_BASE = 'tarea/';

const TareaService = {

  getTareasByProyectoId(proyectoId) {
    return api.get(TAREA_BASE + 'proyecto/' + proyectoId);
  },

  createTarea(tareaData) {
    return api.post(TAREA_BASE + 'nuevo', tareaData);
  },

  updateTarea(id, tareaData) {
    return api.put(TAREA_BASE + id, tareaData);
  },

  deleteTarea(id) {
    return api.delete(TAREA_BASE + id);
  },

  updateEstado(id, estado) {
    return api.put(TAREA_BASE + id + '/estado', { estado });
  },

  // Comentarios
  getComentariosByTareaId(tareaId) {
    return api.get(TAREA_BASE + tareaId + '/comentarios');
  },

  addComentario(tareaId, payload) {
    return api.post(TAREA_BASE + tareaId + '/comentarios', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Archivos
  getFiles(tareaId) {
    return api.get(TAREA_BASE + tareaId + '/archivos');
  },

  uploadFile(tareaId, formData) {
    return api.post(TAREA_BASE + tareaId + '/archivos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  downloadFile(filename) {
    return api.get(TAREA_BASE + 'download/' + filename, {
      responseType: 'blob'
    });
  }
};

export default TareaService;