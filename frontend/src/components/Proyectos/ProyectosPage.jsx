import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProyectoService from "../../services/proyecto.service";

import AuthService from "../../services/auth.service";

import {  } from "module";
import { PlusCircle, Edit3, Trash2, ChevronDown, ChevronRight, Search, Filter } from "lucide-react";

const ProyectosPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ nombre: "", descripcion: "" });
  const [expandedGroups, setExpandedGroups] = useState({
    activo: true,
    pausado: true,
    finalizado: true
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [draggedProject, setDraggedProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", descripcion: "" });

  const currentUser = AuthService.getCurrentUser();
  const currentUserId = currentUser?.id || 1;

  // 🔹 Cargar proyectos del usuario al montar
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    cargarProyectos();
  }, []);

  const cargarProyectos = () => {
    ProyectoService.getProyectosByUsuario(currentUserId)
      .then((res) => setProjects(res.data))
      .catch((err) => {
        console.error("Error al cargar proyectos:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      });
  };

  const handleAdd = () => {
    if (!newProject.nombre.trim()) return;
    const proyecto = {
      nombre: newProject.nombre,
      descripcion: newProject.descripcion || "",
      estado: "activo",
      usuario: { id: currentUserId }
    };

    ProyectoService.crearProyecto(proyecto)
      .then((res) => {
        setProjects([...projects, res.data]);
        setNewProject({ nombre: "", descripcion: "" });
        setShowNewForm(false);
      })
      .catch((err) => console.error("Error al crear proyecto:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proyecto?")) {
      ProyectoService.eliminarProyecto(id)
        .then(() => {
          setProjects(projects.filter((p) => p.id !== id));
        })
        .catch((err) => console.error("Error al eliminar proyecto:", err));
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setEditForm({ nombre: project.nombre, descripcion: project.descripcion });
  };

  const handleSaveEdit = (id) => {
    const proyecto = projects.find(p => p.id === id);
    const proyectoActualizado = {
      ...proyecto,
      nombre: editForm.nombre,
      descripcion: editForm.descripcion
    };

    ProyectoService.actualizarProyecto(id, proyectoActualizado)
      .then((res) => {
        setProjects(projects.map(p => p.id === id ? res.data : p));
        setEditingId(null);
      })
      .catch((err) => console.error("Error al actualizar proyecto:", err));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ nombre: "", descripcion: "" });
  };

  const handleDragStart = (e, project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newEstado) => {
    e.preventDefault();
    if (draggedProject && draggedProject.estado !== newEstado) {
      ProyectoService.cambiarEstado(draggedProject.id, newEstado)
        .then((res) => {
          setProjects(projects.map(p => p.id === draggedProject.id ? res.data : p));
        })
        .catch((err) => console.error("Error al cambiar estado:", err));
    }
    setDraggedProject(null);
  };

  const toggleGroup = (estado) => {
    setExpandedGroups(prev => ({ ...prev, [estado]: !prev[estado] }));
  };

  const handleProjectClick = (project) => {
    navigate(`/proyectos/${project.id}/tareas`);
  };

  const getEstadoBadge = (estado) => {
    const configs = {
      'activo': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Activo' },
      'pausado': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pausado' },
      'finalizado': { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', label: 'Finalizado' }
    };
    const config = configs[estado];
    return <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const getGrupoColor = (estado) => {
    const colors = {
      'activo': 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      'pausado': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      'finalizado': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
    };
    return colors[estado];
  };

  const getGrupoNombre = (estado) => {
    const nombres = {
      'activo': '🟢 Proyectos Activos',
      'pausado': '🟡 Proyectos Pausados',
      'finalizado': '⚪ Proyectos Finalizados'
    };
    return nombres[estado];
  };

  const estados = ["activo", "pausado", "finalizado"];

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-light-surface/80 dark:bg-dark-surface/80 border-b border-light-divider dark:border-dark-divider shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger rounded-lg flex items-center justify-center text-white text-lg shadow-md">
                📋
              </div>
              <h1 className="text-xl font-bold text-light-text dark:text-dark-text tracking-tight">Panel de Proyectos</h1>
              <button className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">⭐</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200">
                Compartir
              </button>
              <button className="px-4 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface text-light-text dark:text-dark-text text-sm font-medium transition-colors">
                Personalizar
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-4 text-sm">
            <button className="border-b-2 border-light-primary dark:border-dark-primary pb-2 font-semibold text-light-text dark:text-dark-text">
              Lista de Proyectos
            </button>
            <button className="text-light-text-secondary dark:text-dark-text-secondary pb-2 hover:text-light-text dark:hover:text-dark-text transition-colors">
              Panel
            </button>
            <button className="text-light-text-secondary dark:text-dark-text-secondary pb-2 hover:text-light-text dark:hover:text-dark-text transition-colors">
              Cronología
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[105px] z-30 bg-light-surface dark:bg-dark-surface border-b border-light-divider dark:border-dark-divider px-6 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background flex items-center gap-2 text-sm font-medium text-light-text dark:text-dark-text transition-colors"
          >
            <PlusCircle size={16} />
            <span>Agregar Proyecto</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background text-sm font-medium text-light-text dark:text-dark-text flex items-center gap-2 transition-colors">
              <Filter size={14} />
              <span>Filtros</span>
            </button>
            <button className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background text-sm font-medium text-light-text dark:text-dark-text transition-colors">
              Ordenar
            </button>
            <button className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background text-sm font-medium text-light-text dark:text-dark-text transition-colors">
              Opciones
            </button>
            <button className="p-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background text-light-text dark:text-dark-text transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Formulario Nuevo Proyecto */}
      {showNewForm && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 px-6 py-4">
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm border border-light-divider dark:border-dark-divider p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={newProject.nombre}
                onChange={(e) => setNewProject({ ...newProject, nombre: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 flex-1 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newProject.descripcion}
                onChange={(e) => setNewProject({ ...newProject, descripcion: e.target.value })}
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 flex-1 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-colors"
              />
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

      {/* Table Header */}
      <div className="bg-light-surface dark:bg-dark-surface border-b border-light-divider dark:border-dark-divider px-6 py-2.5">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
          <div className="col-span-5">Nombre del Proyecto</div>
          <div className="col-span-4">Descripción</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-1">Acciones</div>
        </div>
      </div>

      {/* Lista de Proyectos */}
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
                ({projects.filter(p => p.estado === estado).length})
              </span>
            </div>

            {expandedGroups[estado] && (
              <div className="ml-6 space-y-2">
                {projects
                  .filter((p) => p.estado === estado)
                  .map((project) => (
                    <div
                      key={project.id}
                      draggable={editingId !== project.id}
                      onDragStart={(e) => handleDragStart(e, project)}
                      className="bg-light-surface dark:bg-dark-surface border border-light-divider dark:border-dark-divider rounded-lg hover:shadow-md transition-all duration-200 cursor-move"
                    >
                      {editingId === project.id ? (
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                          <div className="col-span-5">
                            <input
                              type="text"
                              value={editForm.nombre}
                              onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                              className="w-full border border-light-divider dark:border-dark-divider rounded px-3 py-1.5 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="text"
                              value={editForm.descripcion}
                              onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                              className="w-full border border-light-divider dark:border-dark-divider rounded px-3 py-1.5 text-sm bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                            />
                          </div>
                          <div className="col-span-3 flex gap-2 justify-end">
                            <button
                              onClick={() => handleSaveEdit(project.id)}
                              className="px-3 py-1.5 bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white rounded text-xs font-medium transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 border border-light-divider dark:border-dark-divider rounded hover:bg-light-background dark:hover:bg-dark-background text-light-text dark:text-dark-text text-xs font-medium transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer"
                          onClick={() => handleProjectClick(project)}
                        >
                          <div className="col-span-5 flex items-center gap-2">
                            <span className="text-light-text-secondary dark:text-dark-text-secondary">⋮⋮</span>
                            <span className="text-lg">📁</span>
                            <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                              {project.nombre}
                            </span>
                          </div>
                          <div className="col-span-4">
                            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                              {project.descripcion || "Sin descripción"}
                            </span>
                          </div>
                          <div className="col-span-2">
                            {getEstadoBadge(project.estado)}
                          </div>
                          <div className="col-span-1 flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="text-light-danger hover:text-light-danger/80 dark:text-dark-danger dark:hover:text-dark-danger/80 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
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

export default ProyectosPage;