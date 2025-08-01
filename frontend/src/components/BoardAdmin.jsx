import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminService from '../services/admin.service';
import UserDetailsModal from './UserDetailsModal'; // Importa el componente del modal
import AuthService from '../services/auth.service';
import { useSearchParams } from 'react-router-dom'; // Utilizado para la búsqueda e url

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
    // para implementar la búsqueda
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    // UseEffect para que se actualice la búsqueda
    useEffect(() => {
        if (searchTerm) {
            setSearchParams({ search: searchTerm });
        } else {
            setSearchParams({});
        }
    }, [searchTerm, setSearchParams]);


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
                    console.log("Desconectado del WebSocket");
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

    // Función para buscar usuarios
    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();
        return (user.username.toLowerCase().includes(term) || user.id.toString().includes(term));
    })

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

            <div className="relative mb-6 max-w-xs mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre de usuario o ID"
                    className="w-full max-w-xs pr-10 bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm border border-light-surface dark:border-dark-surface dark:focus:border-dark-primary dark:focus:ring-dark-primary focus:border-light-primary focus:ring-light-primary transition-all duration-300 ease-in-out"
                />

                {searchTerm && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 group">
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-danger dark:hover:text-dark-danger transform hover:scale-110 transition-all duration-200"
                            aria-label="Borrar búsqueda"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4h6v3m2 0v14H7V7h10z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg">
                <div className="relative overflow-x-auto shadow-xl rounded-lg animate-fade-in">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                        <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white animate-gradient-pulse">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left font-extrabold text-xs uppercase tracking-wider"
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left font-extrabold text-xs uppercase tracking-wider"
                                >
                                    Nombre de Usuario
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left font-extrabold text-xs uppercase tracking-wider"
                                >
                                    Correo
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left font-extrabold text-xs uppercase tracking-wider"
                                >
                                    Rol
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-center font-extrabold text-xs uppercase tracking-wider"
                                >
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                                {user.roles.join(', ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => openModal(user)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600 transition-colors duration-200 mr-3 animate-button-glow"
                                                style={{ '--tw-shadow-color': 'rgba(99, 102, 241, 0.5)' }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-2"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Ver Detalles
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.username)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-600 transition-colors duration-200 animate-button-glow"
                                                style={{ '--tw-shadow-color': 'rgba(239, 68, 68, 0.5)' }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-2"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-6 text-center text-gray-500 dark:text-gray-400 italic"
                                    >
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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
