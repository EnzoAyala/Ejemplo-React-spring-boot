import { useEffect } from 'react';
import socketService from '../services/socket.service';
import AuthService from '../services/auth.service';

/**
 * Hook que utiliza el servicio WebSocket centralizado para escuchar actualizaciones de usuarios.
 */
const useWebSocket = (setUsers, setError, setLoading) => {
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            setError("No autenticado. Inicie sesión.");
            setLoading(false);
            return;
        }

        const handleUserUpdate = (incoming) => {
            // Si es un evento de eliminación, remover del estado y salir
            if (incoming?.eventType === 'USER_DELETED' && incoming?.id != null) {
                console.log("WebSocket: Usuario eliminado recibido:", incoming);
                setUsers(prev => prev.filter(u => u.id !== incoming.id));
                return;
            }

            const newUser = {
                ...incoming,
                isOnline: incoming.isOnline !== undefined ? incoming.isOnline : false,
            };

            // Agrega o actualiza el usuario en la lista
            setUsers(prev => {
                const exists = prev.some(u => u.id === newUser.id);
                return exists
                    ? prev.map(u => u.id === newUser.id ? { ...u, ...newUser } : u)
                    : [...prev, newUser];
            });
        };

        const subscriptionId = socketService.subscribe('/topic/user-updates', handleUserUpdate);

        // Limpieza: desuscribirse al desmontar el componente
        return () => {
            socketService.unsubscribe(subscriptionId);
        };
    }, [setUsers, setError, setLoading]);
};

export default useWebSocket;

