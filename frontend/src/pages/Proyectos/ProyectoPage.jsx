import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useSuscripcion } from "../../hooks/useSuscripcion"; // 🔹 Importamos hook

const ProyectosPage = () => {
  const navigate = useNavigate();
  const { suscripcion } = useSuscripcion(); // 🔹 Obtenemos datos reales de suscripción
  const esPremium = suscripcion?.plan?.nombre?.toLowerCase() === "premium";

  const [projects, setProjects] = useState([
    { id: 1, nombre: "Plataforma Web", descripcion: "Sistema para gestión de tareas colaborativas.", estado: "activo", premium: false },
    { id: 2, nombre: "App Móvil", descripcion: "Aplicación para seguimiento de proyectos.", estado: "pausado", premium: true },
    { id: 3, nombre: "Rediseño UI", descripcion: "Mejorar experiencia visual del panel.", estado: "finalizado", premium: false },
  ]);

  const [newProject, setNewProject] = useState({ nombre: "", descripcion: "" });
  const [expandedGroups, setExpandedGroups] = useState({ activo: true, pausado: true, finalizado: true });
  const [showNewForm, setShowNewForm] = useState(false);
  const [draggedProject, setDraggedProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", descripcion: "" });

  // ➕ Agregar proyecto
  const handleAdd = () => {
    if (!newProject.nombre.trim()) return;
    const nuevo = {
      id: Date.now(),
      nombre: newProject.nombre,
      descripcion: newProject.descripcion || "Sin descripción",
      estado: "activo",
      premium: false,
    };
    setProjects([...projects, nuevo]);
    setNewProject({ nombre: "", descripcion: "" });
    setShowNewForm(false);
  };

  // 🗑️ Eliminar proyecto
  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proyecto?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  // ✏️ Editar proyecto
  const handleEdit = (project) => {
    setEditingId(project.id);
    setEditForm({ nombre: project.nombre, descripcion: project.descripcion });
  };

  const handleSaveEdit = (id) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, ...editForm } : p
      )
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ nombre: "", descripcion: "" });
  };

  // 🔄 Drag & drop
  const handleDragStart = (e, project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, newEstado) => {
    e.preventDefault();
    if (draggedProject && draggedProject.estado !== newEstado) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === draggedProject.id ? { ...p, estado: newEstado } : p
        )
      );
    }
    setDraggedProject(null);
  };

  const toggleGroup = (estado) => {
    setExpandedGroups((prev) => ({ ...prev, [estado]: !prev[estado] }));
  };

  const handleProjectClick = (project) => {
    // 🔹 Bloqueo de proyectos premium
    if (project.premium && !esPremium) {
      alert("Este proyecto es Premium. Actualiza tu plan para acceder.");
      return;
    }
    navigate(`/proyectos/${project.id}/tareas`);
  };

  const getEstadoBadge = (estado) => {
    const configs = {
      activo: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Activo" },
      pausado: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", label: "Pausado" },
      finalizado: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", label: "Finalizado" },
    };
    const config = configs[estado];
    return <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  const getGrupoColor = (estado) => {
    const colors = {
      activo: "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300",
      pausado: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
      finalizado: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
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

  const estados = ["activo", "pausado", "finalizado"];

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-light-surface/80 dark:bg-dark-surface/80 border-b border-light-divider dark:border-dark-divider shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-light-text dark:text-dark-text tracking-tight">Panel de Proyectos</h1>
          <div>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
              esPremium ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
            }`}>
              {esPremium ? "PRO" : "FREE"}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar y Formulario nuevo proyecto */}
      <div className="px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className={`px-3 py-2 border rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
            esPremium || !projects.some(p => p.premium) ? "hover:bg-light-background dark:hover:bg-dark-background cursor-pointer" : "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
          }`}
          disabled={!esPremium}
        >
          <PlusCircle size={16} />
          <span>Agregar Proyecto</span>
        </button>
      </div>

      {showNewForm && esPremium && (
        <div className="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 rounded-lg">
          <div className="flex gap-3">
            <input type="text" placeholder="Nombre del proyecto" value={newProject.nombre} onChange={(e) => setNewProject({ ...newProject, nombre: e.target.value })} className="border rounded px-3 py-1.5 flex-1 text-sm" />
            <input type="text" placeholder="Descripción" value={newProject.descripcion} onChange={(e) => setNewProject({ ...newProject, descripcion: e.target.value })} className="border rounded px-3 py-1.5 flex-1 text-sm" />
            <button onClick={handleAdd} className="bg-light-primary hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium">Agregar</button>
            <button onClick={() => setShowNewForm(false)} className="border px-6 py-2 rounded-lg hover:bg-light-background text-sm">Cancelar</button>
          </div>
        </div>
      )}

      {/* Lista de proyectos */}
      <div className="px-6 py-4">
        {estados.map((estado) => (
          <div key={estado} className="mb-6" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, estado)}>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => toggleGroup(estado)} className="hover:bg-light-background dark:hover:bg-dark-background rounded p-1">
                {expandedGroups[estado] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getGrupoColor(estado)}`}>{getGrupoNombre(estado)}</span>
              <span className="text-xs font-medium text-gray-500">({projects.filter((p) => p.estado === estado).length})</span>
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
                      className={`bg-white dark:bg-dark-surface border rounded-lg hover:shadow-md transition-all duration-200 ${
                        project.premium && !esPremium ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {editingId === project.id ? (
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                          <div className="col-span-5">
                            <input type="text" value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm" />
                          </div>
                          <div className="col-span-4">
                            <input type="text" value={editForm.descripcion} onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm" />
                          </div>
                          <div className="col-span-3 flex gap-2 justify-end">
                            <button onClick={() => handleSaveEdit(project.id)} className="px-3 py-1.5 bg-light-primary text-white rounded text-xs">Guardar</button>
                            <button onClick={handleCancelEdit} className="px-3 py-1.5 border rounded text-xs">Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => handleProjectClick(project)} className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
                          <div className="col-span-5 flex items-center gap-2">
                            <span>📁</span>
                            <span className="text-sm font-semibold">{project.nombre}</span>
                            {project.premium && <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded">PRO</span>}
                          </div>
                          <div className="col-span-4">
                            <span className="text-sm text-gray-600">{project.descripcion}</span>
                          </div>
                          <div className="col-span-2">{getEstadoBadge(project.estado)}</div>
                          <div className="col-span-1 flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleEdit(project)} className="text-blue-500 hover:text-blue-700"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
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
