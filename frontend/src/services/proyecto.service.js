import api from './api';

const PROYECTO_BASE = 'proyectos/';

const ProyectoService = {

  getAllProyectos() {
    return api.get(PROYECTO_BASE);
  },

  getProyecto(id) {
    return api.get(PROYECTO_BASE + id);
  },

  createProyecto(proyectoData) {
    return api.post(PROYECTO_BASE + 'nuevo', proyectoData);
  },

  updateProyecto(id, proyectoData) {
    return api.put(PROYECTO_BASE + id, proyectoData);
  },

  deleteProyecto(id) {
    return api.delete(PROYECTO_BASE + id);
  },

  updateEstado(id, estado) {
    return api.put(PROYECTO_BASE + id + '/estado', { estado });
  },

  // Métodos para Colaboradores
  getColaboradores(id) {
    return api.get(PROYECTO_BASE + id + '/colaboradores');
  },

  agregarColaborador(id, colaboradorData) {
    return api.post(PROYECTO_BASE + id + '/colaboradores', colaboradorData);
  },

  eliminarColaborador(id, usuarioId) {
    return api.delete(PROYECTO_BASE + id + '/colaboradores/' + usuarioId);
  }
};

export default ProyectoService;
