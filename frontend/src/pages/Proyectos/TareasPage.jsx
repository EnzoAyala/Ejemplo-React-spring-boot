import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import {
  PlusCircle, Edit3, Trash2, ChevronDown, ChevronRight,
  Search, ArrowLeft, Calendar
} from "lucide-react";
import TareaService from "../../services/tarea.service";
import ProyectoService from "../../services/proyecto.service";
import useSubscription from "../../hooks/useSubscription";

const TareasPage = () => {
  const { proyectoId } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [newTarea, setNewTarea] = useState({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media", responsablesIds: [] });
  const [expandedGroups, setExpandedGroups] = useState({ pendiente: true, en_progreso: true, en_revision: true, completada: true });
  const [showNewForm, setShowNewForm] = useState(false);
  const [draggedTarea, setDraggedTarea] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media", responsablesIds: [] });

  // -- Busqueda en URL y campo --
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Actualizar URL segun busqueda
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  // Sincronizar el campo de búsqueda cuando cambia la URL (e.g., navegación atrás/adelante)
  useEffect(() => {
    const termFromUrl = searchParams.get("search") || "";
    setSearchTerm((prev) => (prev === termFromUrl ? prev : termFromUrl));
  }, [searchParams]);

  useEffect(() => {
    fetchProyecto();
    fetchTareas();
  }, [proyectoId]); // eslint-disable-line react-hooks/exhaustive-deps 
  // *** el de arriba se ignora pero funciona normal aun con error ***

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
        setNewTarea({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media", responsablesIds: [] });
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
    setEditForm({ ...t, responsablesIds: t.responsables?.map(r => r.id) || (t.responsable?.id ? [t.responsable.id] : []) });
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

  // Modal de detalles de tarea
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const commentsContainerRef = useRef(null);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [comentarios]);

  const openDetails = (tarea) => {
    setSelectedTask(tarea);
    setDetailsOpen(true);
    // Cargar comentarios si existieran endpoints
    if (tarea?.id) {
      if (TareaService.getComentariosByTareaId) {
        TareaService.getComentariosByTareaId(tarea.id)
          .then(res => setComentarios(res.data))
          .catch(() => setComentarios([]));
      } else {
        setComentarios([]);
      }
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedTask(null);
    setComentarios([]);
    setNuevoComentario("");
  };

  const handleNewComment = useCallback((comment) => {
    setComentarios((prev) => [...prev, comment]);
  }, []);

  useSubscription(
    selectedTask ? `/topic/tarea/${selectedTask.id}/comentarios` : null,
    handleNewComment
  );

  const handleAddComentario = (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !selectedTask) return;
    if (TareaService.addComentario) {
      TareaService.addComentario(selectedTask.id, { contenido: nuevoComentario })
        .then(() => {
          setNuevoComentario("");
        })
        .catch(err => console.error("Error comentarios:", err));
    }
  };

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
      <div className="sticky bg-light-surface dark:bg-dark-surface border-b border-light-divider dark:border-dark-divider px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 flex items-center gap-2 text-sm font-medium text-light-text dark:text-dark-text transition-colors"
          >
            <PlusCircle size={16} />
            <span>Agregar Tarea</span>
          </button>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tareas..."
                className="w-full pl-9 pr-8 py-2 border border-light-divider dark:border-dark-divider rounded-lg bg-white dark:bg-dark-surface text-sm text-light-text dark:text-dark-text placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Limpiar búsqueda"
                >
                  <Trash2 size={16} color="red" />
                </button>
              )}
            </div>
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
              {/* Asignar responsables múltiples: solo colaboradores invitados */}
              <div className="col-span-1 md:col-span-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">Responsables</label>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2 border border-light-divider dark:border-dark-divider rounded-lg p-2">
                  {(proyecto?.colaboradores || []).map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newTarea.responsablesIds.includes(c.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNewTarea(prev => ({
                            ...prev,
                            responsablesIds: checked
                              ? [...prev.responsablesIds, c.id]
                              : prev.responsablesIds.filter(id => id !== c.id)
                          }));
                        }}
                      />
                      <span>{c.username}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleAdd} className="bg-light-primary dark:bg-dark-primary hover:opacity-90 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm">Agregar</button>
              <button onClick={() => setShowNewForm(false)} className="border border-light-divider dark:border-dark-divider px-6 py-2 rounded-lg hover:bg-light-primary/10 dark:hover:bg-dark-primary/20 text-sm font-medium">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de tareas */}
      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
        {estados.map((estado) => (
          <div key={estado} onDrop={(e) => handleDrop(e, estado)} onDragOver={(e) => e.preventDefault()}>
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
                {tareas
                  .filter(t => t.estado === estado)
                  .filter((t) => {
                    const term = (searchTerm || "").trim().toLowerCase();
                    if (!term) return true;

                    const nombre = (t.titulo || "").toLowerCase();
                    const descripcion = (t.descripcion || "").toLowerCase();
                    return (
                      nombre.includes(term) ||
                      descripcion.includes(term)
                    );
                  })

                  .map((tarea) => (
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
                              <div className="flex-1 cursor-pointer" onClick={() => openDetails(tarea)}>
                                <h3 className="text-sm font-semibold">{tarea.titulo}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{tarea.descripcion || "Sin descripción"}</p>
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
      {detailsOpen && selectedTask && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeDetails}
        >
          <div
            className="w-full max-w-6xl bg-light-surface dark:bg-dark-surface rounded-xl shadow-xl p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    <span>{selectedTask.titulo}</span>
                  </h2>
                  {/* Optional: Add an icon */}
                  <span className="text-light-primary dark:text-dark-primary text-sm">📝</span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {selectedTask.descripcion || 'Sin descripción'}
                </p>
              </div>

              <button
                onClick={closeDetails}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Cerrar
              </button>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* DETALLES */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Detalles de la tarea
                </h3>

                <div className="space-y-3">
                  {/* Fecha */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="text-light-primary dark:text-dark-primary" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Fecha límite:</span>
                    {selectedTask.fechaEntrega || '—'}
                  </div>

                  {/* Prioridad */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-5 h-5 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">P</span>
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Prioridad:</span>
                    {selectedTask.prioridad}
                  </div>

                  {/* Responsables */}
                  <div className="flex flex-col space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Responsables:</span>
                    <div className="flex flex-wrap gap-2">
                      {(selectedTask.responsables ||
                        (selectedTask.responsable ? [selectedTask.responsable] : [])
                      ).map((r) => (
                        <span
                          key={r.id}
                          className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium shadow-sm"
                        >
                          {r.username}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* COMENTARIOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Comentarios</h3>

                <div ref={commentsContainerRef} className="max-h-56 overflow-y-auto rounded-lg p-4 bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider shadow-md">
                  {comentarios.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500">Sin comentarios</p>
                  ) : (
                    <ul className="space-y-3">
                      {comentarios.map((c) => (
                        <li key={c.id} className="text-sm">
                          <div className="font-semibold text-gray-800 dark:text-gray-100">
                            {c.autor?.username || 'Usuario'}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">{c.contenido}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* INPUT + BOTÓN */}
                <form onSubmit={handleAddComentario} className="flex gap-4">
                  <input
                    type="text"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Agregar un comentario..."
                    className="flex-1 border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-surface text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg text-sm transition-all hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>


      )}
    </div>
  );
};

export default TareasPage;
