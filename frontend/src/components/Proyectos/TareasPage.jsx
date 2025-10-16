
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TareaService from "../../services/tareas.service";

import ProyectoService from "../../services/proyecto.service";

import { 
  PlusCircle, Edit3, Trash2, ChevronDown, ChevronRight, 
  Search, Filter, ArrowLeft, Calendar, User 
} from "lucide-react";

const TareasPage = () => {
  const { proyectoId } = useParams(); // ID del proyecto desde la URL
  const navigate = useNavigate();
  
  const [proyecto, setProyecto] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [newTarea, setNewTarea] = useState({
    titulo: "",
    descripcion: "",
    fechaEntrega: "",
    prioridad: "media"
  });
  
  const [expandedGroups, setExpandedGroups] = useState({
    pendiente: true,
    en_progreso: true,
    en_revision: true,
    completada: true
  });
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [draggedTarea, setDraggedTarea] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    titulo: "",
    descripcion: "",
    fechaEntrega: "",
    prioridad: "media"
  });

  const currentUserId = 1; // Obtener del contexto de autenticación

  // 🔹 Cargar proyecto y tareas al montar el componente
  useEffect(() => {
    cargarProyecto();
    cargarTareas();
  }, [proyectoId]);

  const cargarProyecto = () => {
    // Aquí deberías tener un método en ProyectoService para obtener un proyecto por ID
    // Por ahora usamos un placeholder
    ProyectoService.getProyectosByUsuario(currentUserId)
      .then((res) => {
        const proyectoEncontrado = res.data.find(p => p.id === parseInt(proyectoId));
        setProyecto(proyectoEncontrado);
      })
      .catch((err) => console.error("Error al cargar proyecto:", err));
  };

  const cargarTareas = () => {
    TareaService.getTareasByProyecto(proyectoId)
      .then((res) => setTareas(res.data))
      .catch((err) => console.error("Error al cargar tareas:", err));
  };

  // 🔹 Crear tarea
  const handleAdd = () => {
    if (!newTarea.titulo.trim()) return;
    
    const tareaData = {
      titulo: newTarea.titulo,
      descripcion: newTarea.descripcion || "",
      estado: "pendiente",
      fechaEntrega: newTarea.fechaEntrega || null,
      prioridad: newTarea.prioridad,
      idProyecto: parseInt(proyectoId),
      idResponsable: currentUserId
    };

    TareaService.crearTarea(tareaData)
      .then((res) => {
        setTareas([...tareas, res.data]);
        setNewTarea({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media" });
        setShowNewForm(false);
      })
      .catch((err) => console.error("Error al crear tarea:", err));
  };

  // 🔹 Eliminar tarea
  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta tarea?")) {
      TareaService.eliminarTarea(id)
        .then(() => {
          setTareas(tareas.filter((t) => t.id !== id));
        })
        .catch((err) => console.error("Error al eliminar tarea:", err));
    }
  };

  // 🔹 Editar tarea
  const handleEdit = (tarea) => {
    setEditingId(tarea.id);
    setEditForm({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaEntrega: tarea.fechaEntrega || "",
      prioridad: tarea.prioridad
    });
  };

  const handleSaveEdit = (id) => {
    const tareaData = {
      titulo: editForm.titulo,
      descripcion: editForm.descripcion,
      estado: tareas.find(t => t.id === id).estado, // Mantener el estado actual
      fechaEntrega: editForm.fechaEntrega || null,
      prioridad: editForm.prioridad,
      idProyecto: parseInt(proyectoId),
      idResponsable: currentUserId
    };

    TareaService.actualizarTarea(id, tareaData)
      .then((res) => {
        setTareas(tareas.map(t => t.id === id ? res.data : t));
        setEditingId(null);
      })
      .catch((err) => console.error("Error al actualizar tarea:", err));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media" });
  };

  // 🔹 Drag & Drop
  const handleDragStart = (e, tarea) => {
    setDraggedTarea(tarea);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, nuevoEstado) => {
    e.preventDefault();
    if (draggedTarea && draggedTarea.estado !== nuevoEstado) {
      TareaService.cambiarEstado(draggedTarea.id, nuevoEstado)
        .then((res) => {
          setTareas(tareas.map(t => t.id === draggedTarea.id ? res.data : t));
        })
        .catch((err) => console.error("Error al cambiar estado:", err));
    }
    setDraggedTarea(null);
  };

  const toggleGroup = (estado) => {
    setExpandedGroups(prev => ({ ...prev, [estado]: !prev[estado] }));
  };

  // 🔹 Funciones auxiliares para badges y colores
  // eslint-disable-next-line no-unused-vars
  const getEstadoBadge = (estado) => {
    const configs = {
      pendiente: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", label: "Pendiente" },
      en_progreso: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "En Progreso" },
      en_revision: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", label: "En Revisión" },
      completada: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Completada" }
    };
    const config = configs[estado];
    return <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const getPrioridadBadge = (prioridad) => {
    const configs = {
      baja: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "Baja", icon: "🔵" },
      media: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", label: "Media", icon: "🟡" },
      alta: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Alta", icon: "🔴" }
    };
    const config = configs[prioridad];
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text} inline-flex items-center gap-1`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getGrupoColor = (estado) => {
    const colors = {
      pendiente: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
      en_progreso: "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
      en_revision: "bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300",
      completada: "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
    };
    return colors[estado];
  };

  const getGrupoNombre = (estado) => {
    const nombres = {
      pendiente: "⚪ Pendientes",
      en_progreso: "🔵 En Progreso",
      en_revision: "🟣 En Revisión",
      completada: "🟢 Completadas"
    };
    return nombres[estado];
  };

  const getEstadoProyectoBadge = (estado) => {
    const configs = {
      activo: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Activo" },
      pausado: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", label: "Pausado" },
      finalizado: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", label: "Finalizado" }
    };
    const config = configs[estado];
    return <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const estados = ["pendiente", "en_progreso", "en_revision", "completada"];

  if (!proyecto) {
    return (
      <div className="min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center">
        <p className="text-light-text dark:text-dark-text">Cargando proyecto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header de Tareas */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-light-surface/80 dark:bg-dark-surface/80 border-b border-light-divider dark:border-dark-divider shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/proyectos")}
                className="p-2 hover:bg-light-background dark:hover:bg-dark-background rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-light-text dark:text-dark-text" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger rounded-lg flex items-center justify-center text-white text-lg shadow-md">
                ✓
              </div>
              <div>
                <h1 className="text-xl font-bold text-light-text dark:text-dark-text tracking-tight">
                  {proyecto.nombre}
                </h1>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {proyecto.descripcion}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getEstadoProyectoBadge(proyecto.estado)}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[89px] z-30 bg-light-surface dark:bg-dark-surface border-b border-light-divider dark:border-dark-divider px-6 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background flex items-center gap-2 text-sm font-medium text-light-text dark:text-dark-text transition-colors"
          >
            <PlusCircle size={16} />
            <span>Agregar Tarea</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background text-sm font-medium text-light-text dark:text-dark-text flex items-center gap-2 transition-colors">
              <Filter size={14} />
              <span>Filtros</span>
            </button>
            <button className="p-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background text-light-text dark:text-dark-text transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Formulario Nueva Tarea */}
      {showNewForm && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 px-6 py-4">
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm border border-light-divider dark:border-dark-divider p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Título de la tarea"
                value={newTarea.titulo}
                onChange={(e) => setNewTarea({ ...newTarea, titulo: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newTarea.descripcion}
                onChange={(e) => setNewTarea({ ...newTarea, descripcion: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"
              />
              <input
                type="date"
                value={newTarea.fechaEntrega}
                onChange={(e) => setNewTarea({ ...newTarea, fechaEntrega: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"
              />
              <select
                value={newTarea.prioridad}
                onChange={(e) => setNewTarea({ ...newTarea, prioridad: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"
              >
                <option value="baja">Prioridad Baja</option>
                <option value="media">Prioridad Media</option>
                <option value="alta">Prioridad Alta</option>
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAdd}
                className="bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="border border-light-divider dark:border-dark-divider px-6 py-2 rounded-lg hover:bg-light-background dark:hover:bg-dark-background text-light-text dark:text-dark-text text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Tareas */}
      <div className="px-6 py-4">
        {estados.map((estado) => (
          <div 
            key={estado} 
            className="mb-6"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, estado)}
          >
            <div className="flex items-center gap-2 mb-3">
              <button 
                onClick={() => toggleGroup(estado)}
                className="hover:bg-light-background dark:hover:bg-dark-background rounded p-1 text-light-text-secondary dark:text-dark-text-secondary transition-colors"
              >
                {expandedGroups[estado] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getGrupoColor(estado)} shadow-sm`}>
                {getGrupoNombre(estado)}
              </span>
              <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                ({tareas.filter(t => t.estado === estado).length})
              </span>
            </div>

            {expandedGroups[estado] && (
              <div className="ml-6 space-y-2">
                {tareas
                  .filter((t) => t.estado === estado)
                  .map((tarea) => (
                    <div
                      key={tarea.id}
                      draggable={editingId !== tarea.id}
                      onDragStart={(e) => handleDragStart(e, tarea)}
                      className="bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-lg hover:shadow-md transition-all duration-200 cursor-move"
                    >
                      {editingId === tarea.id ? (
                        <div className="p-4 space-y-3">
                          <input
                            type="text"
                            value={editForm.titulo}
                            onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                            className="w-full border border-light-divider dark:border-dark-divider rounded px-3 py-2 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                          />
                          <input
                            type="text"
                            value={editForm.descripcion}
                            onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                            className="w-full border border-light-divider dark:border-dark-divider rounded px-3 py-2 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="date"
                              value={editForm.fechaEntrega}
                              onChange={(e) => setEditForm({ ...editForm, fechaEntrega: e.target.value })}
                              className="border border-light-divider dark:border-dark-divider rounded px-3 py-2 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                            />
                            <select
                              value={editForm.prioridad}
                              onChange={(e) => setEditForm({ ...editForm, prioridad: e.target.value })}
                              className="border border-light-divider dark:border-dark-divider rounded px-3 py-2 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                            >
                              <option value="baja">Baja</option>
                              <option value="media">Media</option>
                              <option value="alta">Alta</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(tarea.id)}
                              className="px-4 py-2 bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white rounded text-sm font-medium transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 border border-light-divider dark:border-dark-divider rounded hover:bg-light-background dark:hover:bg-dark-background text-light-text dark:text-dark-text text-sm font-medium transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2 flex-1">
                              <span className="text-light-text-secondary dark:text-dark-text-secondary mt-1">⋮⋮</span>
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-light-text dark:text-dark-text mb-1">
                                  {tarea.titulo}
                                </h3>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                  {tarea.descripcion || "Sin descripción"}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(tarea)}
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(tarea.id)}
                                className="text-light-danger hover:text-light-danger/80 dark:text-dark-danger dark:hover:text-dark-danger/80 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {getPrioridadBadge(tarea.prioridad)}
                            {tarea.fechaEntrega && (
                              <div className="flex items-center gap-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">
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