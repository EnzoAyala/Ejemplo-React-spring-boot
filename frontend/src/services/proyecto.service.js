import api from "./api";

const API_BASE = "proyectos";

class ProyectoService {
  // Obtener proyectos por usuario
  getProyectosByUsuario(usuarioId) {
    return api.get(`${API_BASE}/usuario/${usuarioId}`);
  }

  // Obtener un proyecto por ID
  getProyectoById(id) {
    return api.get(`${API_BASE}/${id}`);
  }

  // Crear proyecto
  crearProyecto(proyecto) {
    return api.post(API_BASE, proyecto);
  }

  // Actualizar proyecto
  actualizarProyecto(id, proyecto) {
    return api.put(`${API_BASE}/${id}`, proyecto);
  }

  // Eliminar proyecto
  eliminarProyecto(id) {
    return api.delete(`${API_BASE}/${id}`);
  }

  // Cambiar estado del proyecto (Drag & Drop)
  cambiarEstado(id, nuevoEstado) {
    return api.patch(`${API_BASE}/${id}/estado`, { estado: nuevoEstado });
  }
}

export default new ProyectoService();