import { useCallback } from 'react';
import AdminService from '../services/admin.service';
import AuthService from '../services/auth.service';

/**
 * Hook para obtener usuarios desde el backend.
 * Maneja errores y sesión expirada.
 */
const useFetchUsers = (setUsers, setLoading, setError) => {
    return useCallback(() => {
        setLoading(true);
        setError(null);

        AdminService.getAllUsers()
            .then(res => setUsers(res.data)) // Actualiza usuarios
            .catch(err => {
                const msg = err?.response?.data?.message || err.message;
                setError("Error al cargar usuarios: " + msg);
                console.error("Error al cargar usuarios:", err);

                // Si la sesión expiró o no está autorizada
                if ([401, 403].includes(err?.response?.status)) {
                    AuthService.logout();
                    window.location.reload();
                }
            })
            .finally(() => setLoading(false)); // Oculta loader al finalizar
    }, [setUsers, setLoading, setError]);
};

export default useFetchUsers;
