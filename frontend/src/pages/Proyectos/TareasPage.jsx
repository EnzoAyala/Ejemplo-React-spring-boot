import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  PlusCircle, Edit3, Trash2, ChevronDown, ChevronRight,
  Search, Filter, ArrowLeft, Calendar
} from "lucide-react";
import TareaService from "../../services/tarea.service";
import ProyectoService from "../../services/proyecto.service";

const TareasPage = () => {
  const { proyectoId } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [newTarea, setNewTarea] = useState({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media" });
  const [expandedGroups, setExpandedGroups] = useState({ pendiente: true, en_progreso: true, en_revision: true, completada: true });
  const [showNewForm, setShowNewForm] = useState(false);
  const [draggedTarea, setDraggedTarea] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media" });

  useEffect(() => {
    fetchProyecto();
    fetchTareas();
  }, [proyectoId]);

  const fetchProyecto = () => {
    ProyectoService.getProyecto(proyectoId)
      .then(response => setProyecto(response.data))
      .catch(error => console.error("Error al obtener proyecto:", error));
  };

  const fetchTareas = () => {
    console.log("Obtiendo tareas...");
    TareaService.getTareasByProyectoId(proyectoId)
      .then(response => setTareas(response.data))
      .catch(error => console.error("Error al obtener tareas:", error));
  };

  const handleAdd = () => {
    if (!newTarea.titulo.trim()) return;
    TareaService.createTarea({ ...newTarea, proyectoId })
      .then(() => {
        fetchTareas();
        setNewTarea({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media" });
        setShowNewForm(false);
      })
      .catch(error => console.error("Error al crear tarea:", error));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar tarea?")) {
      TareaService.deleteTarea(id)
        .then(() => fetchTareas())
        .catch(error => console.error("Error al eliminar tarea:", error));
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setEditForm(t);
  };

  const handleSaveEdit = (id) => {
    TareaService.updateTarea(id, editForm)
      .then(() => {
        fetchTareas();
        setEditingId(null);
      })
      .catch(error => console.error("Error al actualizar tarea:", error));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDragStart = (e, t) => {
    setDraggedTarea(t);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, nuevoEstado) => {
    e.preventDefault();
    if (draggedTarea) {
      TareaService.updateEstado(draggedTarea.id, nuevoEstado)
        .then(() => fetchTareas())
        .catch(error => console.error("Error updating task state:", error));
    }
  };

  const toggleGroup = (estado) => setExpandedGroups(prev => ({ ...prev, [estado]: !prev[estado] }));

  const estados = ["pendiente", "en_progreso", "en_revision", "completada"];

  const getPrioridadBadge = (p) => {
    const map = {
      baja: "bg-light-primary/10 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary",
      media: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      alta: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
    };
    const icon = { baja: "🔵", media: "🟡", alta: "🔴" };
    return <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${map[p]} inline-flex items-center gap-1`}>{icon[p]} {p}</span>;
  };

  const getGrupoColor = (estado) => {
    const map = {
      pendiente: "bg-light-surface dark:bg-dark-surface text-gray-800 dark:text-gray-200",
      en_progreso: "bg-blue-100/40 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      en_revision: "bg-purple-100/40 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      completada: "bg-green-100/40 dark:bg-green-900/30 text-green-700 dark:text-green-300"
    };
    return map[estado];
  };

  const getGrupoNombre = (estado) => {
    const map = {
      pendiente: "⚪ Pendientes",
      en_progreso: "🔵 En Progreso",
      en_revision: "🟣 En Revisión",
      completada: "🟢 Completadas"
    };
    return map[estado];
  };

  const getEstadoProyectoBadge = (estado) => {
    const map = {
      activo: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      pausado: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      finalizado: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    };
    const label = { activo: "Activo", pausado: "Pausado", finalizado: "Finalizado" };
    return <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${map[estado]}`}>{label[estado]}</span>;
  };

  if (!proyecto) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-light-divider dark:border-dark-divider shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NavLink to="/proyectos" className="p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-light-text dark:text-dark-text" />
            </NavLink>
            <div className="w-8 h-8 bg-gradient-to-br from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent rounded-lg flex items-center justify-center text-white text-lg shadow-md">✓</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{proyecto.nombre}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{proyecto.descripcion}</p>
            </div>
          </div>
          {getEstadoProyectoBadge(proyecto.estado)}
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[89px] z-30 bg-light-surface dark:bg-dark-surface border-b border-light-divider dark:border-dark-divider px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 flex items-center gap-2 text-sm font-medium text-light-text dark:text-dark-text transition-colors"
          >
            <PlusCircle size={16} />
            <span>Agregar Tarea</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 text-sm font-medium flex items-center gap-2">
              <Filter size={14} />
              <span>Filtros</span>
            </button>
            <button className="p-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/20">
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Formulario nuevo */}
      {showNewForm && (
        <div className="bg-light-primary/5 dark:bg-dark-primary/10 border-b border-light-divider dark:border-dark-divider px-6 py-4">
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm border border-light-divider dark:border-dark-divider p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Título de la tarea" value={newTarea.titulo} onChange={(e) => setNewTarea({ ...newTarea, titulo: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-transparent focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary" />
              <input type="text" placeholder="Descripción" value={newTarea.descripcion} onChange={(e) => setNewTarea({ ...newTarea, descripcion: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-transparent focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary" />
              <input type="date" value={newTarea.fechaEntrega} onChange={(e) => setNewTarea({ ...newTarea, fechaEntrega: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-transparent focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary" />
              <select value={newTarea.prioridad} onChange={(e) => setNewTarea({ ...newTarea, prioridad: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-transparent focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                <option value="baja">Prioridad Baja</option>
                <option value="media">Prioridad Media</option>
                <option value="alta">Prioridad Alta</option>
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleAdd} className="bg-light-primary dark:bg-dark-primary hover:opacity-90 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm">Agregar</button>
              <button onClick={() => setShowNewForm(false)} className="border border-light-divider dark:border-dark-divider px-6 py-2 rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 text-sm font-medium">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de tareas */}
      <div className="px-6 py-4">
        {estados.map((estado) => (
          <div key={estado} className="mb-6" onDrop={(e) => handleDrop(e, estado)} onDragOver={(e) => e.preventDefault()}>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => toggleGroup(estado)} className="hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 rounded p-1">
                {expandedGroups[estado] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getGrupoColor(estado)} shadow-sm`}>
                {getGrupoNombre(estado)}
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                ({tareas.filter(t => t.estado === estado).length})
              </span>
            </div>

            {expandedGroups[estado] && (
              <div className="ml-6 space-y-2">
                {tareas.filter(t => t.estado === estado).map((tarea) => (
                  <div key={tarea.id} draggable={!editingId} onDragStart={(e) => handleDragStart(e, tarea)}
                    className="bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-lg hover:shadow-md transition-all duration-200 cursor-move">
                    {editingId === tarea.id ? (
                      <div className="p-4 space-y-3">
                        <input type="text" value={editForm.titulo} onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                          className="w-full border border-light-divider dark:border-dark-divider rounded px-3 py-2 text-sm bg-transparent focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary" />
                        <input type="text" value={editForm.descripcion} onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                          className="w-full border border-light-divider dark:border-dark-divider rounded px-3 py-2 text-sm bg-transparent focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="date" value={editForm.fechaEntrega} onChange={(e) => setEditForm({ ...editForm, fechaEntrega: e.target.value })}
                            className="border border-light-divider dark:border-dark-divider rounded px-3 py-2 text-sm bg-transparent focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary" />
                          <select value={editForm.prioridad} onChange={(e) => setEditForm({ ...editForm, prioridad: e.target.value })}
                            className="border border-light-divider dark:border-dark-divider rounded px-3 py-2 text-sm bg-transparent focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveEdit(tarea.id)} className="px-4 py-2 bg-light-primary dark:bg-dark-primary hover:opacity-90 text-white rounded text-sm">Guardar</button>
                          <button onClick={handleCancelEdit} className="px-4 py-2 border border-light-divider dark:border-dark-divider rounded hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 text-sm">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-2 flex-1">
                            <span className="text-gray-400 dark:text-gray-500 mt-1">⋮⋮</span>
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold">{tarea.titulo}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{tarea.descripcion || "Sin descripción"}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(tarea)} className="text-light-primary dark:text-dark-primary hover:opacity-80 p-1.5 rounded">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => handleDelete(tarea.id)} className="text-red-500 hover:text-red-600 p-1.5 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {getPrioridadBadge(tarea.prioridad)}
                          {tarea.fechaEntrega && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <Calendar size={14} />
                              <span>{tarea.fechaEntrega}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TareasPage;
