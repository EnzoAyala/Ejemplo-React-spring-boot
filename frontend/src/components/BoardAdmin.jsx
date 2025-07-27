// frontend/src/components/BoardAdmin.jsx
import React, { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import UserDetailsModal from './UserDetailsModal'; // Importa el componente del modal

const BoardAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Para el usuario seleccionado en el modal

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        setError(null);
        UserService.getAllUsers()
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                const errorMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                setError("Error al cargar usuarios: " + errorMessage);
                console.error("Error al cargar usuarios:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        fetchUsers(); // Recargar usuarios después de cerrar el modal por si hubo cambios
    };

    const handleRolesUpdated = () => {
        // Si los roles se actualizan en el modal, recargamos la lista de usuarios
        fetchUsers();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full text-light-text dark:text-dark-text">
                Cargando usuarios...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4 text-light-danger dark:text-dark-danger">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold text-light-primary dark:text-dark-primary mb-8 text-center">
                Gestión de Usuarios (Panel de Administrador)
            </h2>

            <div className="overflow-x-auto bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-light-border dark:divide-dark-border text-sm">
                    <thead className="bg-light-background dark:bg-dark-background">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
                                Username
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
                                Roles
                            </th>
                            <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-light-border dark:divide-dark-border">
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id} className="hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-light-text dark:text-dark-text font-medium">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-light-text dark:text-dark-text">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-light-text dark:text-dark-text">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-light-text dark:text-dark-text">
                                        {user.roles.join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => openModal(user)}
                                            className="inline-block px-4 py-1.5 bg-light-primary text-white text-sm font-semibold rounded-md hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 transition-colors duration-200"
                                        >
                                            Ver Detalles / Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-6 text-center text-light-text-secondary dark:text-dark-text-secondary"
                                >
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={closeModal}
                    onRolesUpdated={handleRolesUpdated} // Pasa el callback para recargar la lista
                />
            )}
        </div>

    );
};

export default BoardAdmin;