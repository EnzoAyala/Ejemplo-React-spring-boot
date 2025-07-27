// frontend/src/components/UserDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import UserService from '../services/user.service';

const UserDetailsModal = ({ user, onClose, onRolesUpdated }) => {
  // Inicializa el estado 'selectedRole' con el rol actual del usuario.
  // Asumimos que un usuario tendrá al menos un rol. Si tiene múltiples, elegimos el primero.
  // Para la funcionalidad de radio button, solo podemos tener un rol "seleccionado" en el estado.
  const [selectedRole, setSelectedRole] = useState(user.roles && user.roles.length > 0 ? user.roles[0] : 'ROLE_USER');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Efecto para cerrar el modal si se presiona la tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Manejador de cambio para los radio buttons
  const handleRoleChange = (event) => {
    // El valor del radio button seleccionado se obtiene directamente de event.target.value
    setSelectedRole(event.target.value);
    setMessage(''); // Limpiar mensajes al cambiar selección
  };

  const handleUpdateRoles = () => {
    // Con radio buttons, siempre habrá un valor para selectedRole (a menos que el initial state fuera null)
    // Pero mantenemos la validación por robustez.
    if (!selectedRole) {
      setMessage("Debe seleccionar un rol para el usuario.");
      setIsError(true);
      return;
    }

    setLoadingUpdate(true);
    setMessage('');
    setIsError(false);

    // Envía el rol seleccionado como un array de un solo elemento,
    // que es lo que espera el backend para updateUserRoles.
    UserService.updateUserRoles(user.id, [selectedRole])
      .then(response => {
        setMessage(response.data.message);
        setIsError(false);
        // Llama al callback para que el componente padre (BoardAdmin) recargue la lista de usuarios
        if (onRolesUpdated) {
          onRolesUpdated();
        }
        // Puedes cerrar el modal automáticamente después de un éxito si lo deseas:
        // setTimeout(() => onClose(), 1500);
      })
      .catch(error => {
        const errorMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage("Error al actualizar roles: " + errorMessage);
        setIsError(true);
        console.error("Error al actualizar roles:", error);

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setMessage("Sesión expirada o no autorizado. Por favor, vuelva a iniciar sesión.");
          // Opcional: Si es 401 (Unauthorized), puedes forzar un logout y recarga para que el usuario inicie sesión de nuevo
          // import AuthService from '../services/auth.service';
          // AuthService.logout();
          // window.location.reload();
        }
      })
      .finally(() => {
        setLoadingUpdate(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-light-background/70 dark:bg-dark-background/70 flex items-center justify-center z-50 p-6">
      <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-2xl w-full max-w-2xl p-8 relative transform transition-all duration-300 scale-100 opacity-100">

        {/* Título del modal */}
        <h3 className="text-3xl font-extrabold text-light-primary dark:text-dark-primary mb-6 border-b pb-3 border-light-border dark:border-dark-border">
          Detalles de Usuario
        </h3>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-light-text-secondary hover:text-light-primary dark:text-dark-text-secondary dark:hover:text-dark-primary text-3xl"
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        {/* Información del usuario */}
        <div className="space-y-3 text-base text-light-text dark:text-dark-text mb-8">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Nombre:</strong> {user.name || 'N/A'}</p>
          <p><strong>Apellido:</strong> {user.lastname || 'N/A'}</p>
          <p><strong>DNI:</strong> {user.dni || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {user.phone || 'N/A'}</p>
          <p><strong>Roles actuales:</strong> {user.roles.join(', ')}</p>
        </div>

        {/* Sección cambiar rol */}
        <div className="border-t pt-6 border-light-border dark:border-dark-border mb-6">
          <h4 className="text-xl font-semibold text-light-primary dark:text-dark-primary mb-4">Cambiar Rol:</h4>
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio" // <-- ¡CAMBIO IMPORTANTE! Ahora es un radio button
                className="form-radio text-light-primary dark:text-dark-primary h-5 w-5"
                name="userRole" // <-- ¡IMPORTANTE! Mismo 'name' para el grupo de radio buttons
                value="ROLE_USER"
                checked={selectedRole === "ROLE_USER"} // <-- Compara con selectedRole
                onChange={handleRoleChange}
              />
              <span className="ml-3 text-light-text dark:text-dark-text">User</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-light-primary dark:text-dark-primary h-5 w-5"
                name="userRole"
                value="ROLE_ADMIN"
                checked={selectedRole === "ROLE_ADMIN"}
                onChange={handleRoleChange}
              />
              <span className="ml-3 text-light-text dark:text-dark-text">Admin</span>
            </label>

            {/* Si tienes más roles y quieres que sean mutuamente excluyentes, añádelos aquí con el mismo name="userRole" */}
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`p-4 rounded-md mb-6 text-sm font-medium ${isError
            ? 'bg-light-danger/10 text-light-danger dark:bg-dark-danger/20 dark:text-dark-danger'
            : 'bg-light-success/10 text-light-success dark:bg-dark-success/20 dark:text-dark-success'
            }`}>
            {message}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md bg-light-background text-light-text hover:bg-light-hover dark:bg-dark-background dark:text-dark-text dark:hover:bg-dark-hover transition-colors duration-200"
          >
            Cerrar
          </button>

          <button
            onClick={handleUpdateRoles}
            disabled={loadingUpdate}
            className={`px-6 py-2.5 rounded-md font-semibold transition-colors duration-200 ${loadingUpdate
              ? 'bg-light-primary/50 dark:bg-dark-primary/50 cursor-not-allowed'
              : 'bg-light-primary text-white hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90'
              }`}
          >
            {loadingUpdate ? 'Actualizando...' : 'Actualizar Rol'}
          </button>
        </div>
      </div>
    </div>

  );
};

export default UserDetailsModal;