import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminService from '../services/admin.service'; // Cambié UserService por AdminService, porque aquí usás métodos admin (getAllUsers, deleteUser)
import UserDetailsModal from './UserDetailsModal'; // Importa el componente del modal
import AuthService from '../services/auth.service'; // Asegúrate de que esta importación sea correcta

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// URL de tu endpoint WebSocket en la misma IP y puerto que tu backend Spring Boot
const WS_URL = 'http://192.168.1.2:8080/ws';

const BoardAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Para el usuario seleccionado en el modal
    const stompClient = useRef(null);
    const connectionAttempts = useRef(0);

    // Este useEffect se encarga de la conexión WebSocket
    useEffect(() => {
        // Evita ejecutar si ya hay un cliente STOMP conectado.
        if (stompClient.current && stompClient.current.connected) {
            return;
        }

        const currentUser = AuthService.getCurrentUser();
        const token = currentUser ? currentUser.accessToken : null;

        if (!token) {
            console.error("No se encontró el token JWT. No se puede conectar al WebSocket. Por favor, inicie sesión.");
            setError("No autenticado. Por favor, inicie sesión para ver el panel de administración.");
            setLoading(false);
            return;
        }

        const connectWebSocket = () => {
            console.log("Opening Web Socket...");
            const socket = new SockJS(WS_URL);
            stompClient.current = Stomp.over(socket);

            // Opcional: para evitar muchos logs de STOMP, podés desactivar la depuración
            stompClient.current.debug = null;

            // Conectar con encabezados de autenticación
            stompClient.current.connect(
                { Authorization: `Bearer ${token}` }, // Envía el token en el encabezado
                () => {
                    console.log("Conectado al WebSocket");
                    connectionAttempts.current = 0; // Reiniciar contador de intentos al conectar

                    // Suscribirse al topic de actualizaciones de usuarios
                    stompClient.current.subscribe("/topic/user-updates", (message) => {
                        const newUser = JSON.parse(message.body);
                        console.log("Nuevo usuario recibido:", newUser);

                        // Actualiza o añade el usuario en la lista
                        setUsers((prevUsers) => {
                            const userExists = prevUsers.some(u => u.id === newUser.id);
                            if (userExists) {
                                return prevUsers.map(user => user.id === newUser.id ? newUser : user);
                            }
                            return [...prevUsers, newUser];
                        });
                    });
                },
                (error) => { // El callback de error recibe un 'frame' de error o un string
                    const errorMessage = error.headers ? error.headers.message : error.toString();
                    console.error("Error de conexión WebSocket:", errorMessage);

                    if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
                        console.error("Error de autenticación WebSocket. Token inválido o expirado. Forzando cierre de sesión.");
                        AuthService.logout(); // Forzar cierre de sesión
                        window.location.reload(); // Recargar la página
                    } else if (connectionAttempts.current < 3) {
                        connectionAttempts.current++;
                        console.log(`Intentando reconectar en 5 segundos... (${connectionAttempts.current})`);
                        setTimeout(connectWebSocket, 5000); // Intentar reconectar
                    } else {
                        setError("No se pudo conectar al WebSocket después de varios intentos: " + errorMessage);
                    }
                }
            );
        };

        connectWebSocket();

        // Función de limpieza para desconectar el cliente STOMP cuando el componente se desmonte
        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect(() => {
                    console.log("Disconnected from WebSocket");
                });
            }
        };
    }, []); // El array de dependencia vacío asegura que se ejecute una sola vez al montar y desmontar


    // fetchUsers se mantiene para la carga inicial y para recargar manualmente si es necesario
    const fetchUsers = useCallback(() => {
        setLoading(true);
        setError(null);

        AdminService.getAllUsers() // Cambié UserService por AdminService, porque ahí están los métodos admin
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

                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setError("Sesión expirada o no autorizado. Por favor, vuelva a iniciar sesión.");
                    AuthService.logout(); // Si la sesión expiró, fuerza el cierre de sesión
                    window.location.reload(); // Recarga la página para ir al login
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Carga inicial de usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Sincronizar selectedUser con la lista actualizada de usuarios
    useEffect(() => {
        if (showModal && selectedUser) {
            const updatedUserInList = users.find(u => u.id === selectedUser.id);

            if (updatedUserInList) {
                // Evitar actualizar si roles no cambiaron para prevenir renders innecesarios
                if (JSON.stringify(updatedUserInList.roles) !== JSON.stringify(selectedUser.roles)) {
                    setSelectedUser(updatedUserInList);
                }
            } else {
                // Usuario eliminado: cerrar modal
                setShowModal(false);
                setSelectedUser(null);
            }
        }
    }, [users, selectedUser, showModal]);

    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleRolesUpdated = () => {
        // Refrescar lista cuando los roles se actualizan en el modal
        fetchUsers();
    };

    // Función para eliminar usuario
    const handleDeleteUser = (userId, username) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${username}? Esta acción es irreversible.`)) {
            AdminService.deleteUser(userId) // Cambiado a AdminService
                .then(response => {
                    alert(response.data.message || `Usuario ${username} eliminado exitosamente`);
                    fetchUsers(); // Recargar la lista tras eliminar usuario
                })
                .catch(error => {
                    const errorMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();
                    alert("Error al eliminar usuario: " + errorMessage);
                    console.error("Error al eliminar usuario:", error);

                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        AuthService.logout();
                        window.location.reload();
                    }
                });
        }
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
                                Nombre de Usuario
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
                                Correo
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">
                                Rol
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
                                            className="inline-block px-4 py-1.5 bg-light-primary text-white text-sm font-semibold rounded-md hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90 transition-colors duration-200 mr-2"
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                            className="inline-block px-4 py-1.5 bg-light-danger text-white text-sm font-semibold rounded-md hover:bg-light-danger/90 dark:bg-dark-danger dark:hover:bg-dark-danger/90 transition-colors duration-200"
                                        >
                                            Eliminar
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
                    onRolesUpdated={handleRolesUpdated}
                />
            )}
        </div>
    );
};

export default BoardAdmin;
