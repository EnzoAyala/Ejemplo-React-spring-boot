// frontend/src/components/UserDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import AdminService from '../../services/admin.service';
import AuthService from '../../services/auth.service';

const UserDetailsModal = ({ user, onClose, onRolesUpdated }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // controla la animación de cierre

  // Actualiza el estado cada vez que cambia el usuario recibido como prop
  useEffect(() => {
    if (user && user.roles && user.roles.length > 0) {
      setSelectedRole(user.roles[0]); // se toma el primer rol si hay varios
    } else {
      setSelectedRole('ROLE_USER'); // por defecto
    }
    setMessage('');
    setIsError(false);
  }, [user]);

  // Permite cerrar el modal con la tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]); // ** bota error de React Hokk useEffect ** //

  // Cambia el rol seleccionado al marcar un radio button
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setMessage('');
  };

  // Cierra el modal con animación suave
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // duración de la animación
  };

  // Llama al backend para actualizar el rol del usuario
  const handleUpdateRoles = () => {
    if (!selectedRole) {
      setMessage('Debe seleccionar un rol para el usuario.');
      setIsError(true);
      return;
    }

    setLoadingUpdate(true);
    setMessage('');
    setIsError(false);

    AdminService.updateUserRoles(user.id, [selectedRole])
      .then((response) => {
        setMessage(response.data.message);
        setIsError(false);
        if (onRolesUpdated) {
          onRolesUpdated(selectedRole); // informa al padre para recargar usuarios
        }
      })
      .catch((error) => {
        const errorMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage('Error al actualizar roles: ' + errorMessage);
        setIsError(true);
        console.error('Error al actualizar roles:', error);

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setMessage('Sesión expirada o no autorizado. Por favor, vuelva a iniciar sesión.');
          AuthService.logout();
          window.location.reload();
        }
      })
      .finally(() => {
        setLoadingUpdate(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-dark-bg/70 flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-in backdrop-blur-sm">
      <div
        className={`bg-light-bg dark:bg-dark-surface rounded-3xl shadow-3xl w-[30rem] max-w-2xl p-6 sm:p-8 relative transform transition-all duration-300 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
      >
        {/* Encabezado */}
        <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent mb-6 pb-4 border-b border-light-surface dark:border-dark-surface leading-tight">
          Detalles de Usuario
        </h3>

        {/* Botón cerrar */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-danger dark:hover:text-dark-danger text-4xl leading-none transition-colors duration-200"
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        {/* Datos del usuario */}
        <div className="space-y-4 text-base text-light-text dark:text-dark-text mb-8">
          <p><strong className="font-semibold">ID:</strong> {user.id}</p>
          <p><strong className="font-semibold">Username:</strong> {user.username}</p>
          <p><strong className="font-semibold">Email:</strong> {user.email}</p>
          <p><strong className="font-semibold">Nombre:</strong> {user.name || 'N/A'}</p>
          <p><strong className="font-semibold">Apellido:</strong> {user.lastname || 'N/A'}</p>
          <p><strong className="font-semibold">DNI:</strong> {user.dni || 'N/A'}</p>
          <p><strong className="font-semibold">Teléfono:</strong> {user.phone || 'N/A'}</p>
          <p>
            <strong className="font-semibold">Role actual:</strong>{' '}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-light-info text-light-text dark:bg-dark-info dark:text-dark-text">
              {user.roles.join(', ')}
            </span>
          </p>
        </div>

        {/* Selector de rol */}
        <div className="border-t pt-6 border-light-surface dark:border-dark-surface mb-6">
          <h4 className="text-xl font-bold flex items-center text-light-text dark:text-dark-text mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-light-accent dark:text-dark-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V8m-2 4l4-4m-4 4l-4-4m4 4V3"
              />
            </svg>
            Cambiar Rol:
          </h4>

          <div className="flex flex-wrap gap-6">
            {/* Radio para ROLE_USER */}
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-light-accent dark:text-dark-accent"
                name="userRole"
                value="ROLE_USER"
                checked={selectedRole === 'ROLE_USER'}
                onChange={handleRoleChange}
              />
              <span className="ml-3 text-light-text dark:text-dark-text font-medium">
                User
              </span>
            </label>

            {/* Radio para ROLE_ADMIN */}
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-light-accent dark:text-dark-accent"
                name="userRole"
                value="ROLE_ADMIN"
                checked={selectedRole === 'ROLE_ADMIN'}
                onChange={handleRoleChange}
              />
              <span className="ml-3 text-light-text dark:text-dark-text font-medium">
                Admin
              </span>
            </label>

            {/* Agrega más roles aquí si es necesario */}
          </div>
        </div>

        {/* Mensaje de éxito o error */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 text-sm font-medium transition-all duration-300 ${isError
              ? 'bg-light-warning dark:bg-dark-warning text-light-danger dark:text-dark-danger border border-light-danger dark:border-dark-danger'
              : 'bg-light-success dark:bg-dark-success text-light-text dark:text-dark-text border border-light-success dark:border-dark-success'
              }`}
          >
            {message}
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleCloseModal}
            className="px-6 py-2.5 rounded-lg border border-light-surface dark:border-dark-surface bg-light-bg dark:bg-dark-surface text-light-text dark:text-dark-text hover:bg-light-danger hover:text-light-surface dark:hover:bg-dark-danger dark:hover:text-light-surface transition-all duration-300 font-medium shadow-sm"
          >
            Cerrar
          </button>

          <button
            onClick={handleUpdateRoles}
            disabled={loadingUpdate}
            className={`px-6 py-2.5 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${loadingUpdate
              ? 'bg-light-info cursor-not-allowed'
              : 'bg-light-primary hover:bg-light-accent'
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
