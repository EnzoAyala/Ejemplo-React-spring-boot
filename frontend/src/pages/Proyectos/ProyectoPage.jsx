import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Users
} from "lucide-react";
import ProyectoService from "../../services/proyecto.service";
import AuthService from "../../services/auth.service";
import CollaboratorsModal from "../../components/Proyectos/CollaboratorsModal";

const ProyectosPage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ nombre: "", descripcion: "" });
  const [expandedGroups, setExpandedGroups] = useState({
    activo: true,
    pausado: true,
    finalizado: true,
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [draggedProject, setDraggedProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", descripcion: "" });
  const [currentUser, setCurrentUser] = useState(null);
  
  // State for collaborators modal
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    ProyectoService.getAllProyectos()
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener proyectos:", error);
      });
  };

  const handleAdd = () => {
    if (!newProject.nombre.trim()) return;
    ProyectoService.createProyecto(newProject)
      .then(() => {
        fetchProjects();
        setNewProject({ nombre: "", descripcion: "" });
        setShowNewForm(false);
      })
      .catch((error) => {
        console.error("Error al crear proyecto:", error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proyecto?")) {
      ProyectoService.deleteProyecto(id)
        .then(() => {
          fetchProjects();
        })
        .catch((error) => {
          console.error("Error al eliminar proyecto:", error);
        });
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setEditForm({ nombre: project.nombre, descripcion: project.descripcion });
  };

  const handleSaveEdit = (id) => {
    ProyectoService.updateProyecto(id, editForm)
      .then(() => {
        fetchProjects();
        setEditingId(null);
      })
      .catch((error) => {
        console.error("Error updating project:", error);
      });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ nombre: "", descripcion: "" });
  };

  const handleDragStart = (e, project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, newEstado) => {
    e.preventDefault();
    if (draggedProject && draggedProject.estado !== newEstado) {
      ProyectoService.updateEstado(draggedProject.id, newEstado)
        .then(() => {
          fetchProjects();
        })
        .catch((error) => {
          console.error("Error updating project state:", error);
        });
    }
    setDraggedProject(null);
  };

  const toggleGroup = (estado) => {
    setExpandedGroups((prev) => ({ ...prev, [estado]: !prev[estado] }));
  };

  const handleProjectClick = (project) => {
    navigate(`/proyectos/${project.id}/tareas`);
  };
  
  // Handlers for collaborators modal
  const handleOpenCollaboratorsModal = (project) => {
    setSelectedProject(project);
    setIsCollaboratorsModalOpen(true);
  };

  const handleCloseCollaboratorsModal = () => {
    setIsCollaboratorsModalOpen(false);
    setSelectedProject(null);
  };

  const handleCollaboratorUpdate = () => {
    fetchProjects(); // Refetch projects to update collaborator list everywhere
  };

  const getEstadoBadge = (estado) => {
    const configs = {
      activo: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        label: "Activo",
      },
      pausado: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        label: "Pausado",
      },
      finalizado: {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-400",
        label: "Finalizado",
      },
    };
    const config = configs[estado];
    return (
      <span
        className={`px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getGrupoColor = (estado) => {
    const colors = {
      activo:
        "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300",
      pausado:
        "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
      finalizado:
        "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
    };
    return colors[estado];
  };

  const getGrupoNombre = (estado) => {
    const nombres = {
      activo: "🟢 Proyectos Activos",
      pausado: "🟡 Proyectos Pausados",
      finalizado: "⚪ Proyectos Finalizados",
    };
    return nombres[estado];
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-light-surface/80 dark:bg-dark-surface/80 border-b border-light-divider dark:border-dark-divider shadow-sm">
        <div className="px-4 sm:px-6 md:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-3 sm:gap-y-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger rounded-lg flex items-center justify-center text-white text-lg shadow-md">
                📋
              </div>
              <h1 className="text-xl font-bold text-light-text dark:text-dark-text tracking-tight">
                Panel de Proyectos
              </h1>
              <button className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                ⭐
              </button>
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
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[105px] z-30 bg-light-surface dark:bg-dark-surface border-b border-light-divider dark:border-dark-divider px-4 sm:px-6 md:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-3 sm:gap-y-0 w-full">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="w-full sm:w-auto px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg hover:bg-light-background dark:hover:bg-dark-background flex items-center justify-center gap-2 text-sm font-medium text-light-text dark:text-dark-text transition-colors"
          >
            <PlusCircle size={16} />
            <span>Agregar Proyecto</span>
          </button>

          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-light-divider dark:border-dark-divider rounded-lg flex items-center gap-2 text-sm text-light-text dark:text-dark-text transition-colors">
              <Filter size={14} />
              <span>Filtros</span>
            </button>
            <button className="p-2 border border-light-divider dark:border-dark-divider rounded-lg text-light-text dark:text-dark-text transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Formulario nuevo proyecto */}
      {showNewForm && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 px-4 sm:px-6 md:px-8 py-4">
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm border border-light-divider dark:border-dark-divider p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={newProject.nombre}
                onChange={(e) =>
                  setNewProject({ ...newProject, nombre: e.target.value })
                }
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 flex-1 text-sm"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newProject.descripcion}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    descripcion: e.target.value,
                  })
                }
                className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2 flex-1 text-sm"
              />
                              <button
                                onClick={handleAdd}
                                className="w-full md:w-auto bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium"
                              >                Agregar
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="w-full md:w-auto border border-light-divider px-6 py-2 rounded-lg hover:bg-light-background text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de proyectos */}
      <div className="px-4 sm:px-6 md:px-8 py-4">
        {["activo", "pausado", "finalizado"].map((estado) => (
          <div
            key={estado}
            className="mb-6"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, estado)}
          >
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => toggleGroup(estado)}
                className="hover:bg-light-background dark:hover:bg-dark-background rounded p-1"
              >
                {expandedGroups[estado] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              <span
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getGrupoColor(
                  estado
                )}`}
              >
                {getGrupoNombre(estado)}
              </span>
              <span className="text-xs font-medium text-gray-500">
                ({projects.filter((p) => p.estado === estado).length})
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
                      className="bg-white dark:bg-dark-surface border rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      {editingId === project.id ? (
                        <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 p-4 items-center">
                          <div className="sm:col-span-2 md:col-span-5">
                            <input
                              type="text"
                              value={editForm.nombre}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  nombre: e.target.value,
                                })
                              }
                              className="w-full border rounded px-3 py-1.5 text-sm"
                            />
                          </div>
                          <div className="sm:col-span-2 md:col-span-4">
                            <input
                              type="text"
                              value={editForm.descripcion}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  descripcion: e.target.value,
                                })
                              }
                              className="w-full border rounded px-3 py-1.5 text-sm"
                            />
                          </div>
                          <div className="sm:col-span-2 md:col-span-3 flex flex-row gap-2 justify-start sm:justify-end">
                            <button
                              onClick={() => handleSaveEdit(project.id)}
                              className="px-3 py-1.5 bg-light-primary text-white rounded text-xs"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 border rounded text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 p-4 items-center"
                        >
                          <div className="sm:col-span-1 md:col-span-4 flex items-center gap-2 cursor-pointer"  onClick={() => handleProjectClick(project)}>
                            <span>📁</span>
                            <span className="text-sm font-semibold">
                              {project.nombre}
                            </span>
                          </div>
                          <div className="sm:col-span-1 md:col-span-3 truncate" onClick={() => handleProjectClick(project)}>
                            <span className="text-sm text-gray-600">
                              {project.descripcion}
                            </span>
                          </div>
                          {/* Progress Bar */}
                          <div className="sm:col-span-1 md:col-span-2 flex items-center" onClick={() => handleProjectClick(project)}>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${project.progreso}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                              {project.progreso?.toFixed(0)}%
                            </span>
                          </div>
                           <div className="sm:col-span-1 md:col-span-1" onClick={() => handleProjectClick(project)}>
                             <div className="flex -space-x-2 overflow-hidden">
                                {project.colaboradores?.slice(0, 3).map(c => (
                                    <span key={c.id} title={c.username} className="inline-block h-6 w-6 md:h-7 md:w-7 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 flex items-center justify-center text-xs md:text-sm">
                                        {c.username.charAt(0).toUpperCase()}
                                    </span>
                                ))}
                                {project.colaboradores?.length > 3 && (
                                    <span className="flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-300 text-xs md:text-sm">
                                        +{project.colaboradores.length - 3}
                                    </span>
                                )}
                            </div>
                          </div>
                          <div className="sm:col-span-1 md:col-span-1" onClick={() => handleProjectClick(project)}>
                            {getEstadoBadge(project.estado)}
                          </div>
                          <div
                            className="sm:col-span-2 md:col-span-1 flex gap-2 justify-start sm:justify-end"
                            onClick={(e) => e.stopPropagation()}
                          >
                             <button
                              onClick={() => handleOpenCollaboratorsModal(project)}
                              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                              title="Gestionar Colaboradores"
                            >
                              <Users size={16} className="md:size-[18px]" />
                            </button>
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity"
                            >
                              <Edit3 size={16} className="md:size-[18px]" />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="text-light-danger dark:text-dark-danger hover:opacity-80 transition-opacity"
                            >
                              <Trash2 size={16} className="md:size-[18px]" />
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
      
      {/* Collaborators Modal */}
      {selectedProject && (
        <CollaboratorsModal
          isOpen={isCollaboratorsModalOpen}
          onClose={handleCloseCollaboratorsModal}
          project={selectedProject}
          onCollaboratorUpdate={handleCollaboratorUpdate}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ProyectosPage;
