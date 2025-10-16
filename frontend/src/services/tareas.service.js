import api from "./api";

const API_BASE = "tareas";

class TareaService {
  // Obtener todas las tareas
  getAllTareas() {
    return api.get(API_BASE);
  }

  // Obtener tareas por proyecto
  getTareasByProyecto(proyectoId) {
    return api.get(`${API_BASE}/proyecto/${proyectoId}`);
  }

  // Obtener tareas por responsable
  getTareasByResponsable(responsableId) {
    return api.get(`${API_BASE}/responsable/${responsableId}`);
  }

  // Obtener una tarea por ID
  getTareaById(id) {
    return api.get(`${API_BASE}/${id}`);
  }

  // Crear nueva tarea
  crearTarea(tarea) {
    return api.post(API_BASE, tarea);
  }

  // Actualizar tarea
  actualizarTarea(id, tarea) {
    return api.put(`${API_BASE}/${id}`, tarea);
  }

  // Eliminar tarea
  eliminarTarea(id) {
    return api.delete(`${API_BASE}/${id}`);
  }

  // Cambiar solo el estado (para drag & drop)
  cambiarEstado(id, nuevoEstado) {
    return api.patch(`${API_BASE}/${id}/estado`, { estado: nuevoEstado });
  }
}

export default new TareaService();