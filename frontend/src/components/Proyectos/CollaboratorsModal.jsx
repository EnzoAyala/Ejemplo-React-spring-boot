import React, { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Check } from 'lucide-react';
import UserService from '../../services/user.service';
import ProyectoService from '../../services/proyecto.service';

const CollaboratorsModal = ({ isOpen, onClose, project, onCollaboratorUpdate, currentUser }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [collaborators, setCollaborators] = useState(project?.colaboradores || []);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('lector');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCollaborators(project?.colaboradores || []);
      UserService.getAllUsers()
        .then(response => {
          setAllUsers(response.data);
        })
        .catch(err => console.error("Error al obtener usuarios:", err));
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleAddCollaborator = () => {
    if (!selectedUserId) {
      setError('Por favor, selecciona un usuario.');
      return;
    }
    setError('');
    setLoading(true);

    const collaboratorData = {
      usuarioId: parseInt(selectedUserId, 10),
      rol: selectedRole
    };

    ProyectoService.agregarColaborador(project.id, collaboratorData)
      .then(response => {
        setCollaborators([...collaborators, response.data]);
        setSelectedUserId('');
        setSelectedRole('lector');
        if (onCollaboratorUpdate) onCollaboratorUpdate();
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error al agregar colaborador.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveCollaborator = (userId) => {
    if (window.confirm('¿Seguro que deseas eliminar a este colaborador?')) {
      setLoading(true);
      ProyectoService.eliminarColaborador(project.id, userId)
        .then(() => {
          setCollaborators(collaborators.filter(c => c.id !== userId));
          if (onCollaboratorUpdate) onCollaboratorUpdate();
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Error al eliminar colaborador.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleInvitationResponse = (response) => {
    setLoading(true);
    ProyectoService.responderInvitacion(project.id, response)
      .then(() => {
        const updatedCollaborators = collaborators.map(c =>
          c.id === currentUser.id ? { ...c, estadoInvitacion: response } : c
        );
        setCollaborators(updatedCollaborators);
        if (onCollaboratorUpdate) onCollaboratorUpdate();
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error al responder a la invitación.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateRole = (userId, newRole) => {
    setLoading(true);
    ProyectoService.updateColaboradorRol(project.id, userId, newRole)
      .then(() => {
        const updatedCollaborators = collaborators.map(c =>
          c.id === userId ? { ...c, rolEnProyecto: newRole } : c
        );
        setCollaborators(updatedCollaborators);
        if (onCollaboratorUpdate) onCollaboratorUpdate();
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error al actualizar el rol.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const availableUsers = allUsers.filter(user =>
    !collaborators.some(c => c.id === user.id)
  );

  const isCurrentUserAdmin = currentUser && currentUser.id === project.adminId;

  return (
    <div
      className="
                  fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4
                  backdrop-blur-sm
                "
      onClick={onClose}
    >
      <div
        className="
                    bg-light-surface dark:bg-dark-surface
                    text-light-text dark:text-dark-text
                    rounded-2xl shadow-2xl shadow-black/50
                    w-full max-w-3xl mx-auto p-6 md:p-8
                    transition-all duration-300 ease-out transform
                    animate-scale-in
                  "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-light-elevated dark:border-dark-elevated pb-4 mb-6">
          <h2 className="text-2xl font-extrabold text-light-primary dark:text-dark-primary">
            Colaboradores de "{project.nombre}"
          </h2>
          <button
            onClick={onClose}
            className="
                        p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary
                        hover:bg-light-elevated dark:hover:bg-dark-elevated
                        hover:text-light-accent dark:hover:text-dark-accent
                        transition-colors duration-200
                      "
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Add collaborator form */}
        {isCurrentUserAdmin && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 p-4 rounded-xl border border-light-elevated dark:border-dark-elevated bg-light-elevated/30 dark:bg-dark-elevated/30">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="
                          flex-grow rounded-lg px-4 py-2 text-sm
                          bg-light-bg dark:bg-dark-bg
                          border-light-elevated dark:border-dark-elevated
                          text-light-text dark:text-dark-text
                          focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                          outline-none transition-colors shadow-inner
                        "
            >
              <option value="">Seleccionar usuario...</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="
                          rounded-lg px-4 py-2 text-sm
                          bg-light-bg dark:bg-dark-bg
                          border-light-elevated dark:border-dark-elevated
                          text-light-text dark:text-dark-text
                          focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent
                          outline-none transition-colors
                        "
            >
              <option value="lector">Lector</option>
              <option value="editor">Editor</option>
            </select>

            <button
              onClick={handleAddCollaborator}
              disabled={loading || !selectedUserId}
              className="
                          px-5 py-2 bg-light-accent dark:bg-dark-accent
                          text-white rounded-lg text-sm font-semibold
                          flex items-center justify-center gap-2
                          hover:bg-light-accent/90 dark:hover:bg-dark-accent/90
                          transition-all duration-200
                          disabled:opacity-40 disabled:cursor-not-allowed
                        "
            >
              <UserPlus size={16} /> Agregar
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-light-danger dark:text-dark-danger text-sm mb-5 font-medium p-2 rounded bg-light-danger/10 dark:bg-dark-danger/10 border border-light-danger/50 dark:border-dark-danger/50">
            {error}
          </p>
        )}

        {/* Collaborators list */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-3">
          {collaborators.map((c) => (
            <div
              key={c.id}
              className="
                          flex items-center justify-between
                          bg-light-elevated dark:bg-dark-elevated
                          p-4 rounded-xl transition-all duration-200
                          hover:shadow-md hover:ring-2 ring-light-accent/30 dark:ring-dark-accent/30
                        "
            >
              {/* Info de Usuario */}
              <div className="flex flex-col">
                <p className="font-bold text-light-text dark:text-dark-text">
                  {c.username}
                  {c.rolEnProyecto === 'Administrador' && (
                    <span className="ml-2 text-xs font-medium text-light-primary dark:text-dark-primary">
                      (Admin)
                    </span>
                  )}
                </p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {c.email}
                </p>
              </div>

              {/* Estado, Rol y Acciones */}
              <div className="flex items-center gap-3">
                {/* Badge de Estado */}
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${c.estadoInvitacion === 'aceptado'
                      ? 'bg-light-success text-white'
                      : c.estadoInvitacion === 'pendiente'
                        ? 'bg-light-warning text-light-text'
                        : 'bg-light-danger text-white'
                    }`}
                >
                  {c.estadoInvitacion}
                </span>

                {/* Selector de Rol */}
                {isCurrentUserAdmin && c.rolEnProyecto !== 'Administrador' ? (
                  <select
                    value={c.rolEnProyecto}
                    onChange={(e) => handleUpdateRole(c.id, e.target.value)}
                    className="
                                text-xs font-medium px-3 py-1.5 rounded-full
                                bg-light-accent dark:bg-dark-accent text-white
                                border-transparent transition-colors
                                focus:ring-2 focus:ring-light-primary focus:ring-offset-2 focus:ring-offset-light-elevated dark:focus:ring-offset-dark-elevated
                              "
                    disabled={loading}
                  >
                    <option value="lector">Lector</option>
                    <option value="editor">Editor</option>
                  </select>
                ) : (
                  <span className="text-xs font-medium px-3 py-1.5 bg-light-primary dark:bg-dark-primary text-white rounded-full">
                    {c.rolEnProyecto}
                  </span>
                )}

                {/* Botones de Invitación (Aceptar/Rechazar) */}
                {currentUser && currentUser.id === c.id && c.estadoInvitacion === 'pendiente' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInvitationResponse('aceptado')}
                      className="p-2 bg-light-success text-white rounded-full hover:bg-light-success/80 transition-opacity"
                      title="Aceptar invitación"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleInvitationResponse('rechazado')}
                      className="p-2 bg-light-danger text-white rounded-full hover:bg-light-danger/80 transition-opacity"
                      title="Rechazar invitación"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Botón Eliminar */}
                {isCurrentUserAdmin && c.rolEnProyecto !== 'Administrador' && (
                  <button
                    onClick={() => handleRemoveCollaborator(c.id)}
                    disabled={loading}
                    className="
                                text-light-danger dark:text-dark-danger
                                hover:bg-light-danger/10 dark:hover:bg-dark-danger/10
                                p-1.5 rounded-full transition-colors
                                disabled:opacity-40
                              "
                    title="Eliminar colaborador"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsModal;
