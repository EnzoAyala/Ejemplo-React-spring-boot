import React, { useState, useEffect, useCallback, useRef } from 'react';
import UserService from '../services/user.service';
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
    const stompClient = useRef(null); // Usamos useRef para el cliente STOMP

    // Este useEffect se encarga de la conexión WebSocket
    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        const token = currentUser ? currentUser.accessToken : null;

        if (!token) {
            console.error("No se encontró el token JWT. No se puede conectar al WebSocket. Por favor, inicie sesión.");
            // Aquí podrías redirigir al usuario a la página de inicio de sesión
            // Ejemplo con React Router: history.push("/login");
            // O simplemente mostrar un error en la UI y no intentar conectar
            setError("No autenticado. Por favor, inicie sesión para ver el panel de administración.");
            setLoading(false); // Detenemos el estado de carga
            return; // Detiene la ejecución si no hay token
        }

        const connectWebSocket = () => {
            console.log("Opening Web Socket...");
            const socket = new SockJS(WS_URL);
            stompClient.current = Stomp.over(socket);

            // Conectar con encabezados de autenticación
            stompClient.current.connect(
                { 'Authorization': `Bearer ${token}` }, // Envía el token en el encabezado
                () => {
                    console.log("Connected to WebSocket");
                    // Suscribirse al topic de actualizaciones de usuarios
                    stompClient.current.subscribe("/topic/user-updates", (message) => {
                        const newUser = JSON.parse(message.body);
                        console.log("Nuevo usuario recibido:", newUser);
                        // Añadir el nuevo usuario a la lista existente, evitando duplicados
                        setUsers((prevUsers) => {
                            // Si el usuario ya existe (por ID), no lo agregamos de nuevo.
                            // Esto es útil si el backend envía el mismo evento por alguna razón.
                            if (prevUsers.some(u => u.id === newUser.id)) {
                                return prevUsers;
                            }
                            // Si es un usuario nuevo, lo añadimos.
                            // Puedes decidir si lo añades al principio o al final, o si lo ordenas.
                            return [...prevUsers, newUser];
                        });
                    });
                    // La línea stompClient.current.send("/app/registerUser", ...) se elimina
                    // ya que es un mensaje de prueba y no parte de la lógica de actualización.
                },
                (errorFrame) => { // El callback de error recibe un 'frame' de error
                    console.error("Error de conexión WebSocket:", errorFrame);
                    // Puedes analizar errorFrame.headers y errorFrame.body para más detalles
                    if (errorFrame.headers && errorFrame.headers.message && errorFrame.headers.message.includes("Unauthorized")) {
                        console.error("Error de autenticación WebSocket. Token inválido o expirado. Forzando cierre de sesión.");
                        AuthService.logout(); // Forzar cierre de sesión
                        window.location.reload(); // Recargar la página
                    } else {
                        // Opcional: Reintentar la conexión después de un retardo
                        // setTimeout(connectWebSocket, 5000);
                        setError("Error al conectar con el servicio de actualizaciones en tiempo real.");
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
    }, [fetchUsers]); // Ahora depende de la función 'fetchUsers' (que está en useCallback)

    // NUEVO useEffect para sincronizar selectedUser
    // con la lista de 'users' DESPUÉS de que 'users' haya sido actualizada.
    // Esto se ejecuta *después* de que setUsers(response.data) haya finalizado.
    useEffect(() => {
        // Solo intentamos actualizar selectedUser si el modal está abierto
        // y hay un usuario seleccionado previamente.
        if (showModal && selectedUser) {
            // Buscamos la versión más reciente del usuario en la lista actualizada.
            const updatedUserInList = users.find(u => u.id === selectedUser.id);

            if (updatedUserInList) {
                // Comparamos los roles para evitar un setSelectedUser innecesario si los roles no han cambiado, lo que podría provocar re-renders. Usamos JSON.stringify para comparar arrays de objetos de forma simple.
                if (JSON.stringify(updatedUserInList.roles) !== JSON.stringify(selectedUser.roles)) {
                    setSelectedUser(updatedUserInList);
                }
            } else {
                // Si el usuario ya no está en la lista (p.ej., fue eliminado por otro admin),
                // cerramos el modal y limpiamos selectedUser.
                setShowModal(false);
                setSelectedUser(null);
            }
        }
    }, [users, selectedUser, showModal]); // Depende de 'users' (cuando cambia la lista), 'selectedUser' (para saber qué usuario buscar), y 'showModal' (solo ejecutar si el modal está visible).

    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleRolesUpdated = () => {
        // Si los roles se actualizan en el modal, recargamos la lista de usuarios
        fetchUsers();
    };

    // FUNCION para eliminar usuario
    const handleDeleteUser = (userId, username) => {
        // Pedir confirmacion al usuario
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${username}? Esta acción es irreversible.`)) {
            UserService.deleteUser(userId)
                .then(response => {
                    alert(response.data.message || `Usuario ${username} eliminado exitosamente`);
                    fetchUsers(); // Recargar la lista de usuarios para reflejar la eliminación
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
    }

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