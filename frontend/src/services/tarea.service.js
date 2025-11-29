import api from './api';

const TAREA_BASE = 'tareas/';

const TareaService = {

  getTareasByProyectoId(proyectoId) {
    return api.get(TAREA_BASE + 'proyecto/' + proyectoId);
  },

  createTarea(tareaData) {
    return api.post(TAREA_BASE, tareaData);
  },

  updateTarea(id, tareaData) {
    return api.put(TAREA_BASE + id, tareaData);
  },

  deleteTarea(id) {
    return api.delete(TAREA_BASE + id);
  },

  updateEstado(id, estado) {
    return api.put(TAREA_BASE + id + '/estado', { estado });
  }
};

export default TareaService;
