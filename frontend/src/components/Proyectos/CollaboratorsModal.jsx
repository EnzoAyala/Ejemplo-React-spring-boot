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
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text rounded-xl shadow-2xl w-full max-w-3xl mx-auto p-6 transition-all duration-300 ease-out transform scale-100 opacity-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-light-divider dark:border-dark-divider pb-4 mb-4">
          <h2 className="text-2xl font-bold">
            Colaboradores de "{project.nombre}"
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-light-text dark:text-dark-text hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Add collaborator form */}
        {isCurrentUserAdmin && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="flex-grow border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2.5 text-base bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent outline-none transition-colors"
            >
              <option value="">Seleccionar usuario...</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="border border-light-divider dark:border-dark-divider rounded-lg px-4 py-2.5 text-base bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent outline-none transition-colors"
            >
              <option value="lector">Lector</option>
              <option value="editor">Editor</option>
            </select>

            <button
              onClick={handleAddCollaborator}
              disabled={loading}
              className="px-5 py-2.5 bg-light-primary text-white rounded-lg text-base font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <UserPlus size={20} /> Agregar
            </button>
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-light-danger text-sm mb-5 font-medium">{error}</p>}

        {/* Collaborators list */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {collaborators.map(c => (
            <div
              key={c.id}
              className="flex items-center justify-between bg-light-elevated dark:bg-dark-elevated p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold text-light-text dark:text-dark-text">
                  {c.username}
                </p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {c.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  c.estadoInvitacion === 'aceptado' ? 'bg-green-500 text-white' :
                  c.estadoInvitacion === 'pendiente' ? 'bg-yellow-500 text-black' :
                  'bg-red-500 text-white'
                }`}>
                  {c.estadoInvitacion}
                </span>

                {isCurrentUserAdmin && c.rolEnProyecto !== 'Administrador' ? (
                  <select
                    value={c.rolEnProyecto}
                    onChange={(e) => handleUpdateRole(c.id, e.target.value)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-light-primary text-white border-transparent focus:border-light-accent focus:ring-0"
                    disabled={loading}
                  >
                    <option value="lector">Lector</option>
                    <option value="editor">Editor</option>
                  </select>
                ) : (
                  <span className="text-xs font-medium px-3 py-1.5 bg-light-primary text-white rounded-full">
                    {c.rolEnProyecto}
                  </span>
                )}

                {currentUser && currentUser.id === c.id && c.estadoInvitacion === 'pendiente' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleInvitationResponse('aceptado')} className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                      <Check size={16} />
                    </button>
                    <button onClick={() => handleInvitationResponse('rechazado')} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                      <X size={16} />
                    </button>
                  </div>
                )}

                {isCurrentUserAdmin && c.rolEnProyecto !== 'Administrador' && (
                  <button
                    onClick={() => handleRemoveCollaborator(c.id)}
                    disabled={loading}
                    className="text-light-danger hover:text-dark-danger disabled:opacity-40 transition-colors"
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
