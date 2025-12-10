import React, { useState, useEffect } from 'react';
import ShowUsers from './ShowUsers';
import UserDetailsModal from './UserDetailsModal';
import { useSearchParams } from 'react-router-dom';
import useFetchUsers from '../../hooks/useFetchUsers';
import useWebSocket from '../../hooks/useWebSocket';
import useUserSync from '../../hooks/useUserSync';
import AdminService from '../../services/admin.service';
import AuthService from '../../services/auth.service';

const BoardAdmin = () => {
    // --- Estados del componente ---
    const [users, setUsers] = useState([]);               // Lista de usuarios
    const [loading, setLoading] = useState(true);         // Indicador de carga
    const [error, setError] = useState(null);             // Mensaje de error
    const [showModal, setShowModal] = useState(false);    // Visibilidad del modal
    const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado

    // --- Búsqueda en URL y campo ---
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    // --- Hooks personalizados ---
    const fetchUsers = useFetchUsers(setUsers, setLoading, setError); // Obtener usuarios
    useWebSocket(setUsers, setError, setLoading);                     // Escuchar cambios en tiempo real
    useUserSync(users, selectedUser, showModal, setSelectedUser, setShowModal); // Sincronizar modal

    // Cargar usuarios al montar
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Actualizar URL según búsqueda
    useEffect(() => {
        setSearchParams(searchTerm ? { search: searchTerm } : {});
    }, [searchTerm, setSearchParams]);

    // Filtrar usuarios por nombre o ID
    const filteredUsers = users.filter((user) => {
        const uname = typeof user?.username === 'string' ? user.username : '';
        const idStr = user?.id != null ? String(user.id) : '';
        return uname.toLowerCase().includes(searchTerm.toLowerCase()) || idStr.includes(searchTerm);
    });

    // Abrir modal con datos de usuario
    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    // Cerrar modal y limpiar selección
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // Recargar usuarios tras actualizar roles
    const handleRolesUpdated = fetchUsers;

    // Eliminar usuario con confirmación
    const handleDeleteUser = (userId, username) => {
        if (window.confirm(`¿Eliminar al usuario ${username}?`)) {
            AdminService.deleteUser(userId)
                .then(response => {
                    alert(response.data.message || `Usuario ${username} eliminado exitosamente`);
                    fetchUsers();
                })
                .catch(error => {
                    const errorMessage =
                        (error.response?.data?.message) || error.message || error.toString();
                    alert("Error al eliminar usuario: " + errorMessage);
                    console.error("Error al eliminar usuario:", error);

                    if ([401, 403].includes(error.response?.status)) {
                        AuthService.logout();
                        window.location.reload();
                    }
                });
        }
    };

    // --- Renderizado condicional ---
    if (loading) {
        return <div className="flex justify-center items-center h-full text-light-text dark:text-dark-text">Cargando usuarios...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-light-danger dark:text-dark-danger">{error}</div>;
    }

    // --- Render principal ---
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-extrabold text-light-primary dark:text-dark-primary mb-10 text-center tracking-tight">
                ✨ Gestión de Usuarios (Panel de Administrador)
            </h2>

            {/* Búsqueda con botón para limpiar */}
            <div className="relative mb-8 max-w-sm mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre de usuario o ID..."
                    // Estilos del input: light-elevated/dark-elevated como fondo, con focus en light-primary/dark-primary
                    className="w-full pr-10 pl-4 py-2 border-2 border-light-elevated dark:border-dark-elevated bg-light-elevated dark:bg-dark-elevated text-light-text dark:text-dark-text rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary placeholder-light-text-secondary dark:placeholder-dark-text-secondary"
                />
                {searchTerm && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <button
                            onClick={() => setSearchTerm('')}
                            // Estilos del botón de limpiar: usa texto secundario con hover a danger
                            className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-danger dark:hover:text-dark-danger transition-colors duration-200"
                            aria-label="Borrar búsqueda"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Tabla de usuarios */}
            {/* Contenedor de la tabla: usa light-surface/dark-surface */}
            <div className="overflow-x-auto bg-light-surface dark:bg-dark-surface rounded-2xl shadow-2xl">
                <div className="relative overflow-x-auto rounded-2xl">
                    <table className="min-w-full divide-y divide-light-elevated dark:divide-dark-elevated text-sm">
                        {/* Encabezado de la tabla (thead) */}
                        <thead className="bg-light-elevated dark:bg-dark-elevated">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-light-primary dark:text-dark-primary">ID</th>
                                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-light-primary dark:text-dark-primary">User Name</th>
                                <th className="px-6 py-4 text-left font-bold text-xs uppercase tracking-wider text-light-primary dark:text-dark-primary">Correo</th>
                                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider text-light-primary dark:text-dark-primary">Rol</th>
                                <th className="px-6 py-4 text-center font-bold text-xs uppercase tracking-wider text-light-primary dark:text-dark-primary">Acciones</th>
                            </tr>
                        </thead>
                        {/* Cuerpo de la tabla (tbody) */}
                        <tbody className="divide-y divide-light-elevated dark:divide-dark-elevated">
                            <ShowUsers
                                users={filteredUsers}
                                onOpenModal={openModal}
                                onDeleteUser={handleDeleteUser}
                            />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de detalles */}
            {showModal && selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={closeModal}
                    onRolesUpdated={handleRolesUpdated}
                />
            )}
        </div>
    );
};

export default BoardAdmin;
