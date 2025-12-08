import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PlusCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  Check,
  X,
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

  // -- Busqueda en URL y campo --
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // State for collaborators modal
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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
      {/* Header: Mejorado con más jerarquía y brillo */}
      <div
        className="
                    sticky top-0 z-40
                    backdrop-blur-md bg-light-surface/90 dark:bg-dark-surface/90
                    border-b border-light-divider dark:border-dark-divider
                    shadow-xl dark:shadow-black/30
                  "
      >
        <div className="px-4 sm:px-6 md:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-3 sm:gap-y-0">
            <div className="flex items-center gap-4">
              <div
                className="
                            w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl font-black
                            bg-gradient-to-br from-light-primary to-light-accent
                            dark:from-dark-primary dark:to-dark-accent
                            shadow-lg shadow-light-primary/50 dark:shadow-dark-primary/40
                          "
              >
                &#128196; {/* 📋 (Clipboard) -> Más formal: 📁 (File Folder) o 📊 (Bar Chart) */}
              </div>
              <h1 className="text-3xl font-extrabold text-light-text dark:text-dark-text tracking-tight">
                Panel de Proyectos
              </h1>
              <button
                className="
                            p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary
                            hover:text-light-warning dark:hover:text-dark-warning transition-colors duration-200
                          "
                title="Marcar como favorito"
              >
                <Star size={24} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Mejorado el botón Agregar Proyecto y el estilo de la búsqueda */}
      <div className="sticky top-[86px] z-30 bg-light-surface dark:bg-dark-surface border-b border-light-divider dark:border-dark-divider px-4 sm:px-6 md:px-8 py-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-3 sm:gap-y-0 w-full">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="
                        w-full sm:w-auto px-5 py-2.5 bg-light-accent dark:bg-dark-accent text-white
                        rounded-xl hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 transition-all duration-200
                        flex items-center justify-center gap-2 text-base font-bold
                        shadow-lg shadow-light-accent/40 dark:shadow-dark-accent/40
                      "
          >
            <PlusCircle size={20} />
            <span>Agregar Proyecto</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar proyectos..."
                className="
                            w-full pl-9 pr-8 py-2.5
                            border-2 border-light-divider dark:border-dark-divider rounded-xl
                            bg-light-bg dark:bg-dark-surface text-sm
                            text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary
                            focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent outline-none transition-colors
                          "
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-light-danger dark:text-dark-danger hover:text-light-danger/80 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} /> {/* Cambiado a 'X' para limpiar, más intuitivo que Trash2 aquí. */}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulario nuevo proyecto: Estilo de tarjeta flotante */}
      {showNewForm && (
        <div className="
                        px-4 sm:px-6 md:px-8 py-4
                        bg-light-elevated/50 dark:bg-dark-elevated/50
                        border-b border-light-divider dark:border-dark-divider
                        animate-fade-in
                      ">
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 border border-light-divider dark:border-dark-divider">
            <h3 className="text-xl font-bold mb-4 border-b border-light-elevated dark:border-dark-elevated pb-2">
              Crear Nuevo Proyecto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Nombre del proyecto (requerido)"
                value={newProject.nombre}
                onChange={(e) =>
                  setNewProject({ ...newProject, nombre: e.target.value })
                }
                className="
                            col-span-full sm:col-span-2 md:col-span-2
                            border border-light-divider dark:border-dark-divider rounded-lg
                            px-4 py-2.5 text-sm bg-light-bg dark:bg-dark-bg
                            focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none
                          "
              />
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={newProject.descripcion}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    descripcion: e.target.value,
                  })
                }
                className="
                            col-span-full sm:col-span-1 md:col-span-2
                            border border-light-divider dark:border-dark-divider rounded-lg
                            px-4 py-2.5 text-sm bg-light-bg dark:bg-dark-bg
                            focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary outline-none
                          "
              />
              <div className="col-span-full md:col-span-1 flex gap-3 justify-end">
                <button
                  onClick={handleAdd}
                  disabled={!newProject.nombre}
                  className="
                              flex-grow md:flex-grow-0 bg-light-primary hover:bg-light-primary/90
                              dark:bg-dark-primary dark:hover:bg-dark-primary/90
                              text-white px-6 py-2.5 rounded-lg text-sm font-semibold
                              transition-all duration-200 disabled:opacity-50
                              shadow-md shadow-light-primary/30 dark:shadow-dark-primary/30
                            "
                >
                  <Check size={16} className="inline mr-1" /> Crear
                </button>
                <button
                  onClick={() => setShowNewForm(false)}
                  className="
                              flex-grow md:flex-grow-0 border-2 border-light-divider dark:border-dark-divider
                              px-6 py-2.5 rounded-lg
                              hover:bg-light-elevated dark:hover:bg-dark-elevated
                              text-light-text-secondary dark:text-dark-text-secondary text-sm
                            "
                >
                  <X size={16} className="inline mr-1" /> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de proyectos (Kanban Board) */}
      <div className="px-4 sm:px-6 md:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {["activo", "pausado", "finalizado"].map((estado) => (
            <div
              key={estado}
              className="
                          min-h-[100px] p-2 rounded-xl
                          bg-light-elevated/70 dark:bg-dark-elevated/70
                          shadow-inner transition-colors
                        "
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, estado)}
            >
              {/* Encabezado de Columna */}
              <div className="flex items-center gap-2 mb-3 px-1 py-1 sticky top-[138px] z-20 bg-light-elevated dark:bg-dark-elevated rounded-lg shadow-md">
                <button
                  onClick={() => toggleGroup(estado)}
                  className="text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background rounded p-1 transition-colors"
                >
                  {expandedGroups[estado] ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
                <span
                  className={`text-sm font-bold px-3 py-1.5 rounded-full ${getGrupoColor(
                    estado
                  )}`}
                >
                  {getGrupoNombre(estado)}
                </span>
                <span className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary">
                  ({projects.filter((p) => p.estado === estado).length})
                </span>
              </div>

              {/* Contenedor de Proyectos */}
              {expandedGroups[estado] && (
                <div className="space-y-4">
                  {projects
                    .filter((p) => p.estado === estado)
                    .filter((p) => {
                      const term = (searchTerm || "").trim().toLowerCase();
                      if (!term) return true;
                      const nombre = (p.nombre || "").toLowerCase();
                      const descripcion = (p.descripcion || "").toLowerCase();
                      const colaboradores = Array.isArray(p.colaboradores)
                        ? p.colaboradores
                        : [];
                      return (
                        nombre.includes(term) ||
                        descripcion.includes(term) ||
                        colaboradores.some((c) =>
                          (c.username || "").toLowerCase().includes(term)
                        )
                      );
                    })
                    .map((project) => (
                      <div
                        key={project.id}
                        draggable={editingId !== project.id}
                        onDragStart={(e) => handleDragStart(e, project)}
                        className="
                                    bg-light-surface dark:bg-dark-surface
                                    rounded-xl shadow-lg hover:shadow-xl
                                    ring-1 ring-light-divider dark:ring-dark-divider
                                    transition-all duration-300 ease-in-out
                                    cursor-grab data-[dragging=true]:cursor-grabbing
                                  "
                      >
                        {/* Project display logic */}
                        {editingId === project.id ? (
                          // 1. MODO EDICIÓN (Tarjeta)
                          <div
                            className="
                                        grid grid-cols-1 md:grid-cols-4 gap-4 p-4
                                        bg-light-elevated/50 dark:bg-dark-elevated/50
                                        rounded-xl border-2 border-light-elevated dark:border-dark-elevated
                                        animate-scale-in transition-all
                                      "
                          >
                            {/* Campo Nombre */}
                            <div className="col-span-1 md:col-span-2">
                              <label
                                htmlFor={`project-name-${project.id}`}
                                className="block text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-1"
                              >
                                Nombre del Proyecto
                              </label>
                              <input
                                id={`project-name-${project.id}`}
                                type="text"
                                value={editForm.nombre}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    nombre: e.target.value,
                                  })
                                }
                                className="
                                            w-full rounded-md px-3 py-2 text-sm
                                            bg-light-bg dark:bg-dark-surface
                                            border border-light-surface dark:border-dark-elevated
                                            text-light-text dark:text-dark-text
                                            focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                                            transition-colors duration-200 shadow-sm
                                          "
                                placeholder="Escribe el nuevo nombre..."
                              />
                            </div>

                            {/* Campo Descripción */}
                            <div className="col-span-1 md:col-span-2">
                              <label
                                htmlFor={`project-description-${project.id}`}
                                className="block text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-1"
                              >
                                Descripción
                              </label>
                              <input
                                id={`project-description-${project.id}`}
                                type="text"
                                value={editForm.descripcion}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    descripcion: e.target.value,
                                  })
                                }
                                className="
                                            w-full rounded-md px-3 py-2 text-sm
                                            bg-light-bg dark:bg-dark-surface
                                            border border-light-surface dark:border-dark-elevated
                                            text-light-text dark:text-dark-text
                                            focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                                            transition-colors duration-200 shadow-sm
                                          "
                                placeholder="Breve descripción del proyecto..."
                              />
                            </div>

                            {/* Botones de acción */}
                            <div className="col-span-full flex gap-3 justify-end pt-2">
                              <button
                                onClick={handleCancelEdit}
                                className="
                                            px-4 py-2 rounded-lg text-sm font-medium
                                            bg-transparent border border-light-text-secondary dark:border-dark-text-secondary
                                            text-light-text-secondary dark:text-dark-text-secondary
                                            hover:bg-light-elevated dark:hover:bg-dark-elevated
                                            transition-colors duration-200
                                          "
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleSaveEdit(project.id)}
                                className="
                                            px-4 py-2 rounded-lg text-sm font-medium
                                            bg-light-primary dark:bg-dark-primary text-white
                                            hover:bg-light-primary/90 dark:hover:bg-dark-primary/90
                                            focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:ring-offset-2
                                            transition-all duration-200 shadow-md shadow-light-primary/30 dark:shadow-dark-primary/30
                                          "
                              >
                                Guardar Cambios
                              </button>
                            </div>
                          </div>
                        ) : (
                          // 2. MODO VISUALIZACIÓN (Tarjeta)
                          <div
                            className="
                                        flex flex-col p-5 h-full
                                        bg-light-surface dark:bg-dark-surface
                                        rounded-xl
                                        transition-all duration-300 ease-in-out cursor-pointer
                                      "
                            onClick={() => handleProjectClick(project)}
                          >
                            {/* Cabecera: Nombre y Estado */}
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex gap-2 items-center">
                                <span className="text-xl text-light-accent dark:text-dark-accent">
                                  📁
                                </span>
                                <span className="font-extrabold text-xl text-light-text dark:text-dark-text">
                                  {project.nombre}
                                </span>
                              </div>
                              {/* Estado del proyecto (Badge) */}
                              <div>{getEstadoBadge(project.estado)}</div>
                            </div>

                            {/* Descripción */}
                            <div className="mb-4 flex-grow">
                              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-2">
                                {project.descripcion || "Sin descripción."}
                              </p>
                            </div>

                            {/* Barra de progreso */}
                            <div className="mb-4 pt-2 border-t border-light-elevated dark:border-dark-elevated">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-light-text dark:text-dark-text">
                                  Progreso
                                </span>
                                <span className="text-sm font-bold text-light-accent dark:text-dark-accent">
                                  {project.progreso?.toFixed(0) || 0}%
                                </span>
                              </div>
                              <div className="w-full bg-light-elevated rounded-full h-2 dark:bg-dark-elevated">
                                <div
                                  className="bg-light-accent dark:bg-dark-accent h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${project.progreso || 0}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Colaboradores y Acciones */}
                            <div className="flex justify-between items-center pt-3 border-t border-light-elevated dark:border-dark-elevated">
                              {/* Colaboradores */}
                              <div>
                                <span className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary block mb-1">
                                  Colaboradores
                                </span>
                                <div className="flex -space-x-2 overflow-hidden">
                                  {project.colaboradores?.slice(0, 4).map((c) => (
                                    <span
                                      key={c.id}
                                      title={c.username}
                                      className="
                                                  h-8 w-8 rounded-full ring-2 ring-light-surface dark:ring-dark-surface
                                                  bg-light-elevated dark:bg-dark-elevated
                                                  flex items-center justify-center text-xs font-medium
                                                  text-light-text dark:text-dark-text
                                                  hover:z-10 transition-transform hover:scale-110
                                                  border border-light-primary/50 dark:border-dark-primary/50
                                                "
                                    >
                                      {c.username.charAt(0).toUpperCase()}
                                    </span>
                                  ))}
                                  {project.colaboradores?.length > 4 && (
                                    <span
                                      className="
                                                  flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-light-surface dark:ring-dark-surface
                                                  bg-light-text-secondary dark:bg-dark-text-secondary
                                                  text-white text-xs font-medium
                                                  hover:z-10 transition-transform hover:scale-110
                                                "
                                    >
                                      +{project.colaboradores.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Botones de acción (Edit, Collabs, Delete) */}
                              <div className="flex gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenCollaboratorsModal(project);
                                  }}
                                  className="
                                              p-2 rounded-full
                                              text-light-text-secondary dark:text-dark-text-secondary
                                              hover:bg-light-elevated dark:hover:bg-dark-elevated
                                              hover:text-light-primary dark:hover:text-dark-primary
                                              transition-colors duration-200
                                            "
                                  title="Gestionar Colaboradores"
                                >
                                  <Users size={18} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(project);
                                  }}
                                  className="
                                              p-2 rounded-full
                                              text-light-accent dark:text-dark-accent
                                              hover:bg-light-elevated dark:hover:bg-dark-elevated
                                              hover:opacity-90 transition-all duration-200
                                            "
                                  title="Editar Proyecto"
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(project.id);
                                  }}
                                  className="
                                              p-2 rounded-full
                                              text-light-danger dark:text-dark-danger
                                              hover:bg-light-danger/10 dark:hover:bg-dark-danger/10
                                              hover:opacity-90 transition-all duration-200
                                            "
                                  title="Eliminar Proyecto"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
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

      {/* Modal de colaboradores (se mantiene sin cambios) */}
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
