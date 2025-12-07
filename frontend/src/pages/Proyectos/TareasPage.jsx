import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import {
  PlusCircle, Edit3, Trash2, Search, ArrowLeft, Calendar,
  Activity, CheckCircle, Clock, Users, MoreVertical, X,
  Plus, MessageSquare, MoreHorizontal
} from "lucide-react";
import TareaService from "../../services/tarea.service";
import ProyectoService from "../../services/proyecto.service";
import useSubscription from "../../hooks/useSubscription";
import DetallesTareas from "../../components/tareasModal/detallesTareas";

const TareasPage = () => {
  const { proyectoId } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [tareas, setTareas] = useState([]);

  // Estado del formulario
  const [newTarea, setNewTarea] = useState({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media", responsablesIds: [] });
  const [showNewForm, setShowNewForm] = useState(false);

  // Estado Drag & Drop y Edición
  const [draggedTarea, setDraggedTarea] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ titulo: "", descripcion: "", fechaEntrega: "", prioridad: "media", responsablesIds: [] });

  // Búsqueda
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Detalles / Comentarios
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const commentsContainerRef = useRef(null);

  const estados = ["pendiente", "en_progreso", "en_revision", "completada"];

  // -- EFECTOS --
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  useEffect(() => {
    const termFromUrl = searchParams.get("search") || "";
    setSearchTerm((prev) => (prev === termFromUrl ? prev : termFromUrl));
  }, [searchParams]);

  useEffect(() => {
    fetchProyecto();
    fetchTareas();
    // eslint-disable-next-line
  }, [proyectoId]);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [comentarios]);

  // -- API CALLS --
  const fetchProyecto = () => {
    ProyectoService.getProyecto(proyectoId)
      .then(response => setProyecto(response.data))
      .catch(error => console.error("Error al obtener proyecto:", error));
  };

  const fetchTareas = () => {
    TareaService.getTareasByProyectoId(proyectoId)
      .then(response => setTareas(response.data))
      .catch(error => console.error("Error al obtener tareas:", error));
  };

  // -- HANDLERS TAREAS --
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
    setEditForm({ ...t, responsablesIds: t.responsables?.map(r => r.id) || [] });
  };

  const handleSaveEdit = (id) => {
    TareaService.updateTarea(id, { ...editForm, responsablesIds: editForm.responsablesIds })
      .then(() => {
        fetchTareas();
        setEditingId(null);
      })
      .catch(error => console.error("Error al actualizar tarea:", error));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // -- DRAG AND DROP --
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

  // -- DETALLES Y COMENTARIOS --
  const openDetails = (tarea) => {
    setSelectedTask(tarea);
    setDetailsOpen(true);
    if (tarea?.id && TareaService.getComentariosByTareaId) {
      TareaService.getComentariosByTareaId(tarea.id)
        .then(res => setComentarios(res.data))
        .catch(() => setComentarios([]));
    } else {
      setComentarios([]);
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
        .then(() => setNuevoComentario(""))
        .catch(err => console.error("Error comentarios:", err));
    }
  };

  // -- HELPERS VISUALES --
  const getGrupoNombre = (estado) => {
    const map = {
      pendiente: "Pendientes",
      en_progreso: "En Progreso",
      en_revision: "En Revisión",
      completada: "Completadas"
    };
    return map[estado] || estado;
  };

  if (!proyecto) return <div className="p-10 text-center">Cargando proyecto...</div>;

  return (
    <div className="min-h-screen bg-light-surface dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300 font-sans">

      {/* 1. HEADER LIMPIO */}
      <div className="bg-light-bg dark:bg-dark-surface px-6 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-light-elevated dark:border-dark-elevated">
        <div className="flex items-center gap-4">
          <NavLink to="/proyectos" className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Volver</span>
          </NavLink>
          <div className="h-6 w-px bg-light-elevated dark:bg-dark-elevated mx-2"></div>
          <div>
            <div className="flex items-center gap-2">
              {/* Usando dark-primary para el punto de proyecto activo */}
              <div className="w-3 h-3 rounded-full bg-light-primary dark:bg-dark-primary"></div>
              <h1 className="text-xl font-bold text-light-text dark:text-dark-text uppercase tracking-wide">PROYECTO</h1>
            </div>
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-0.5">{proyecto.nombre}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Fondo de elevación para el badge de Miembros */}
          <div className="bg-light-surface dark:bg-dark-elevated px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
            <Users size={16} />
            <span>Miembros ({proyecto?.colaboradores?.length || 0})</span>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tareas (Usando Info/Accent) */}
        <div className="bg-light-bg dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-light-elevated dark:border-dark-elevated flex items-center gap-4">
          <div className="p-3 rounded-lg bg-light-info/10 text-light-info dark:bg-dark-info/20 dark:text-dark-info"><Activity size={20} /></div>
          <div>
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-medium">Total Tareas</p>
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">{tareas.length}</h3>
          </div>
        </div>
        {/* Completadas (Usando Success) */}
        <div className="bg-light-bg dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-light-elevated dark:border-dark-elevated flex items-center gap-4">
          <div className="p-3 rounded-lg bg-light-success/10 text-light-success dark:bg-dark-success/20 dark:text-dark-success"><CheckCircle size={20} /></div>
          <div>
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-medium">Completadas</p>
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">{tareas.filter(t => t.estado === 'completada').length}</h3>
          </div>
        </div>
        {/* En Progreso (Usando Warning) */}
        <div className="bg-light-bg dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-light-elevated dark:border-dark-elevated flex items-center gap-4">
          <div className="p-3 rounded-lg bg-light-warning/10 text-light-warning dark:bg-dark-warning/20 dark:text-dark-warning"><Clock size={20} /></div>
          <div>
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-medium">En Progreso</p>
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">{tareas.filter(t => t.estado === 'en_progreso').length}</h3>
          </div>
        </div>
        {/* Miembros (Usando Primary/Accent) */}
        <div className="bg-light-bg dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-light-elevated dark:border-dark-elevated flex items-center gap-4">
          <div className="p-3 rounded-lg bg-light-primary/10 text-light-primary dark:bg-dark-primary/20 dark:text-dark-primary"><Users size={20} /></div>
          <div>
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-medium">Miembros</p>
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">{proyecto?.colaboradores?.length || 0}</h3>
          </div>
        </div>
      </div>

      {/* 3. TABLERO Y BÚSQUEDA */}
      <div className="px-6 border-b border-light-elevated dark:border-dark-elevated flex items-center justify-between bg-light-bg/80 dark:bg-dark-surface/80 backdrop-blur-sm sticky top-[73px] z-30">
        <div className="flex gap-6">
          {['Tablero'].map((tab, idx) => (
            <button key={tab} className={`pb-3 text-sm font-medium transition-colors relative ${idx === 0 ? 'text-light-primary dark:text-dark-primary' : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'}`}>
              {tab}
              {idx === 0 && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-light-primary dark:bg-dark-primary rounded-t-full"></span>}
            </button>
          ))}
        </div>
        <div className="py-2 flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tareas..."
              className="pl-8 pr-3 py-1.5 text-xs bg-light-surface dark:bg-dark-elevated text-light-text dark:text-dark-text rounded-md border-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary w-40 transition-all focus:w-64 placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X size={12} className="text-light-text-secondary hover:text-light-danger dark:text-dark-text-secondary dark:hover:text-dark-danger" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. MODAL FORMULARIO FLOTANTE */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-light-bg dark:bg-dark-surface rounded-xl shadow-2xl border border-light-elevated dark:border-dark-elevated w-full max-w-2xl animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-light-elevated dark:border-dark-elevated">
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text flex items-center gap-2">
                <PlusCircle size={20} className="text-light-accent dark:text-dark-accent" /> Nueva Tarea
              </h3>
              <button onClick={() => setShowNewForm(false)} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text"><X size={20} /></button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-1 block">Título</label>
                <input type="text" placeholder="Ej: Rediseñar Home" value={newTarea.titulo} onChange={(e) => setNewTarea({ ...newTarea, titulo: e.target.value })}
                  className="w-full border border-light-elevated dark:border-dark-elevated rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-elevated text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all outline-none placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50" />
              </div>

              <div>
                <label className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-1 block">Prioridad</label>
                <select value={newTarea.prioridad} onChange={(e) => setNewTarea({ ...newTarea, prioridad: e.target.value })}
                  className="w-full border border-light-elevated dark:border-dark-elevated rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-elevated text-light-text dark:text-dark-text outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-1 block">Fecha Entrega</label>
                <input type="date" value={newTarea.fechaEntrega} onChange={(e) => setNewTarea({ ...newTarea, fechaEntrega: e.target.value })}
                  className="w-full border border-light-elevated dark:border-dark-elevated rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-elevated text-light-text dark:text-dark-text outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-1 block">Descripción</label>
                <textarea placeholder="Detalles de la tarea..." value={newTarea.descripcion} onChange={(e) => setNewTarea({ ...newTarea, descripcion: e.target.value })}
                  className="w-full border border-light-elevated dark:border-dark-elevated rounded-lg px-4 py-2 text-sm bg-light-surface dark:bg-dark-elevated text-light-text dark:text-dark-text h-24 resize-none outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent" />
              </div>

              <div className="col-span-2">
                <p className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2">Asignar Responsables</p>
                <div className="flex flex-wrap gap-2">
                  {(proyecto?.colaboradores || []).map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        const exists = newTarea.responsablesIds.includes(c.id);
                        setNewTarea(prev => ({
                          ...prev,
                          responsablesIds: exists ? prev.responsablesIds.filter(id => id !== c.id) : [...prev.responsablesIds, c.id]
                        }))
                      }}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors flex items-center gap-1 ${newTarea.responsablesIds.includes(c.id)
                          ? 'bg-light-accent/10 border-light-accent text-light-accent dark:bg-dark-accent/20 dark:border-dark-accent dark:text-dark-accent'
                          : 'bg-light-surface border-light-elevated text-light-text-secondary hover:bg-light-elevated dark:bg-dark-elevated dark:border-dark-elevated dark:text-dark-text-secondary dark:hover:bg-dark-elevated/80'
                        }`}
                    >
                      {newTarea.responsablesIds.includes(c.id) && <CheckCircle size={10} />}
                      {c.username}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-light-elevated dark:border-dark-elevated bg-light-surface dark:bg-dark-elevated/30 rounded-b-xl">
              <button onClick={() => setShowNewForm(false)} className="px-6 py-2 rounded-lg text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors">Cancelar</button>
              <button onClick={handleAdd} className="bg-light-accent hover:bg-light-accent/90 dark:bg-dark-accent dark:hover:bg-dark-accent/90 text-white dark:text-dark-bg px-6 py-2 rounded-lg text-sm font-bold shadow-md shadow-light-accent/30 dark:shadow-dark-accent/30 transition-colors animate-button-glow">Crear Tarea</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. KANBAN BOARD PRINCIPAL */}
      <div className="p-6 overflow-x-auto min-h-[calc(100vh-250px)]">
        <div className="flex gap-6 min-w-full lg:min-w-0">
          {estados.map((estado) => {
            // Mapping de colores para los puntos de estado
            const dotColor = estado === 'pendiente' ? 'bg-light-text-secondary dark:bg-dark-text-secondary' :
              estado === 'en_progreso' ? 'bg-light-warning dark:bg-dark-warning' :
                estado === 'en_revision' ? 'bg-light-accent dark:bg-dark-accent' : 'bg-light-success dark:bg-dark-success';

            return (
              <div key={estado} className="flex-1 min-w-[280px]" onDrop={(e) => handleDrop(e, estado)} onDragOver={(e) => e.preventDefault()}>

                {/* Header Columna */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
                    <h3 className="font-bold text-light-text dark:text-dark-text capitalize text-sm">{getGrupoNombre(estado)}</h3>
                    {/* Badge de conteo */}
                    <span className="bg-light-elevated dark:bg-dark-elevated text-light-text-secondary dark:text-dark-text-secondary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {tareas.filter(t => t.estado === estado).length}
                    </span>
                  </div>
                </div>

                {/* Botón Nueva Tarea (Ghost) */}
                <button
                  onClick={() => setShowNewForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 mb-4 rounded-lg border border-dashed border-light-elevated dark:border-dark-elevated text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:border-light-text-secondary dark:hover:border-dark-text-secondary hover:bg-light-surface dark:hover:bg-dark-elevated transition-all text-sm group"
                >
                  <Plus size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Nueva Tarea</span>
                </button>

                {/* Lista de Cards */}
                <div className="space-y-3">
                  {tareas
                    .filter(t => t.estado === estado)
                    .filter((t) => {
                      const term = (searchTerm || "").trim().toLowerCase();
                      if (!term) return true;
                      return (t.titulo || "").toLowerCase().includes(term) || (t.descripcion || "").toLowerCase().includes(term);
                    })
                    .map((tarea) => (
                      <div key={tarea.id} draggable={!editingId} onDragStart={(e) => handleDragStart(e, tarea)}
                        className="bg-light-bg dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-transparent hover:border-light-accent dark:hover:border-dark-accent hover:shadow-md transition-all duration-200 group cursor-move relative"
                      >
                        {editingId === tarea.id ? (
                          // MODO EDICIÓN
                          <div className="space-y-3 animate-scale-in">
                            <input autoFocus className="w-full text-sm font-bold border border-light-elevated dark:border-dark-elevated rounded p-1 bg-light-bg dark:bg-dark-elevated text-light-text dark:text-dark-text" value={editForm.titulo} onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })} />
                            <textarea className="w-full text-xs border border-light-elevated dark:border-dark-elevated rounded p-1 resize-none bg-light-bg dark:bg-dark-elevated text-light-text dark:text-dark-text" rows="2" value={editForm.descripcion} onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })} />
                            <div className="flex justify-between items-center">
                              <select value={editForm.prioridad} onChange={(e) => setEditForm({ ...editForm, prioridad: e.target.value })} className="text-xs border border-light-elevated dark:border-dark-elevated rounded p-1 bg-light-bg dark:bg-dark-elevated text-light-text dark:text-dark-text">
                                <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
                              </select>
                              <div className="flex gap-2">
                                <button onClick={() => handleSaveEdit(tarea.id)} className="text-xs bg-light-success/10 text-light-success dark:bg-dark-success/20 dark:text-dark-success px-2 py-1 rounded hover:bg-light-success/20">Guardar</button>
                                <button onClick={handleCancelEdit} className="text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text px-2 py-1">Cancelar</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // MODO VISTA TARJETA
                          <>
                            <div className="flex justify-between items-start mb-2">
                              {/* Badges de Prioridad (Usando Danger, Warning, Info) */}
                              {tarea.prioridad === 'alta' && <span className="bg-light-danger/10 text-light-danger dark:bg-dark-danger/20 dark:text-dark-danger text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">URGENTE</span>}
                              {tarea.prioridad === 'media' && <span className="bg-light-warning/10 text-light-warning dark:bg-dark-warning/20 dark:text-dark-warning text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">MEDIA</span>}
                              {tarea.prioridad === 'baja' && <span className="bg-light-info/10 text-light-info dark:bg-dark-info/20 dark:text-dark-info text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">BAJA</span>}

                              {/* Botones de acción en hover */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 absolute top-2 right-2 bg-light-bg/90 dark:bg-dark-surface/90 shadow-sm p-1 rounded-md backdrop-blur-sm">
                                <button onClick={() => handleEdit(tarea)} className="p-1 hover:text-light-accent dark:hover:text-dark-accent text-light-text-secondary dark:text-dark-text-secondary"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(tarea.id)} className="p-1 hover:text-light-danger dark:hover:text-dark-danger text-light-text-secondary dark:text-dark-text-secondary"><Trash2 size={14} /></button>
                              </div>
                            </div>

                            <div onClick={() => openDetails(tarea)} className="cursor-pointer mb-3">
                              <h4 className="font-bold text-light-text dark:text-dark-text text-sm mb-1 line-clamp-1">{tarea.titulo}</h4>
                              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary line-clamp-2">{tarea.descripcion || "Sin descripción"}</p>
                            </div>

                            <div className="border-t border-light-elevated dark:border-dark-elevated my-3"></div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-light-text-secondary dark:text-dark-text-secondary">
                                {tarea.fechaEntrega && (
                                  <div className="flex items-center gap-1 text-xs font-medium">
                                    <Calendar size={12} />
                                    <span>{tarea.fechaEntrega}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-xs font-medium hover:text-light-text dark:hover:text-dark-text cursor-pointer" onClick={() => openDetails(tarea)}>
                                  <MessageSquare size={12} />
                                </div>
                              </div>

                              {/* Avatars de Responsables */}
                              <div className="flex -space-x-2">
                                {(tarea.responsables || []).slice(0, 3).map((r, i) => (
                                  <div key={i} title={r.username} className="w-6 h-6 rounded-full bg-light-surface dark:bg-dark-elevated border-2 border-light-bg dark:border-dark-surface flex items-center justify-center text-[9px] font-bold text-light-text-secondary dark:text-dark-text-secondary uppercase">
                                    {r.username.substring(0, 2)}
                                  </div>
                                ))}
                                {(!tarea.responsables || tarea.responsables.length === 0) && (
                                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-light-elevated dark:border-dark-elevated flex items-center justify-center">
                                    <Users size={10} className="text-light-text-secondary dark:text-dark-text-secondary" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DetallesTareas
        isOpen={detailsOpen}
        onClose={closeDetails}
        task={selectedTask}
        comentarios={comentarios}
        nuevoComentario={nuevoComentario}
        setNuevoComentario={setNuevoComentario}
        handleAddComentario={handleAddComentario}
        commentsContainerRef={commentsContainerRef}
      />
    </div>
  );
};

export default TareasPage;