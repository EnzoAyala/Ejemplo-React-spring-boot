import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import AuthService from '../services/auth.service';

// URL del WebSocket (debe coincidir con el backend)
const WS_URL = 'http://192.168.1.2:8080/ws';

/**
 * Hook que maneja la conexión WebSocket para escuchar actualizaciones de usuarios.
 * - Se reconecta hasta 3 veces en caso de error.
 * - Actualiza usuarios en tiempo real al recibir mensajes.
 * - Maneja expiración de sesión y errores.
 */
const useWebSocket = (setUsers, setError, setLoading) => {
    const stompClient = useRef(null);
    const connectionAttempts = useRef(0);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        const token = user?.accessToken;

        if (!token) {
            setError("No autenticado. Inicie sesión.");
            setLoading(false);
            return;
        }

        const connectWebSocket = () => {
            const socket = new SockJS(WS_URL);
            stompClient.current = Stomp.over(socket);
            stompClient.current.debug = null; // Desactiva logs STOMP en consola

            stompClient.current.connect(
                { Authorization: `Bearer ${token}` }, // Enviar token JWT
                () => {
                    // Conexión exitosa
                    connectionAttempts.current = 0;

                    // Suscribirse a actualizaciones de usuarios
                    stompClient.current.subscribe("/topic/user-updates", (message) => {
                        const newUser = JSON.parse(message.body);

                        newUser.online = newUser.isOnline;
                        delete newUser.isOnline;

                        console.log("WebSocket: Nuevo usuario registrado y/o conectado:", newUser);

                        // Agrega o actualiza el usuario en la lista
                        setUsers(prev => {
                            const exists = prev.some(u => u.id === newUser.id);
                            return exists
                                ? prev.map(u => u.id === newUser.id ? newUser : u)
                                : [...prev, newUser];
                        });
                    });
                },
                (error) => {
                    // Manejo de errores de conexión
                    const msg = error?.headers?.message || error.toString();

                    if (msg.includes("Unauthorized") || msg.includes("401")) {
                        AuthService.logout();
                        window.location.reload();
                    } else if (connectionAttempts.current < 3) {
                        // Reintenta conectar hasta 3 veces
                        connectionAttempts.current++;
                        setTimeout(connectWebSocket, 5000);
                    } else {
                        setError("No se pudo conectar al WebSocket: " + msg);
                    }
                }
            );
        };

        connectWebSocket();

        // Limpieza: desconectar al desmontar el componente
        return () => {
            if (stompClient.current?.connected) {
                stompClient.current.disconnect(() =>
                    console.log("WebSocket desconectado")
                );
            }
        };
    }, [setUsers, setError, setLoading]);
};

export default useWebSocket;
