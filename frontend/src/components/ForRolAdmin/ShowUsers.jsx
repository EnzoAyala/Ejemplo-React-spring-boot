import React, { useEffect, useState } from 'react';
import UserActions from './UserActions';

const ShowUsers = ({ users, onOpenModal, onDeleteUser }) => {
    // Tick local para forzar re-render y recalcular tiempo relativo sin refrescar la página

    const [nowTick, setNowTick] = useState(Date.now()); // Error de 'nowTick' is not defined
    useEffect(() => {
        const interval = setInterval(() => setNowTick(Date.now()), 60000); // cada 60s
        return () => clearInterval(interval);
    }, []);

    // Función para ver la última vez que se conectó el usuario
    function tiempoDesde(fechaISO) {
        const fecha = new Date(fechaISO);
        const ahora = new Date(nowTick);
        const diffMs = ahora - fecha;
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return "Hace un momento";
        if (diffMin === 1) return "Hace 1 minuto";
        if (diffMin < 60) return `Hace ${diffMin} minutos`;

        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs === 1) return "Hace 1 hora";
        if (diffHrs < 24) return `Hace ${diffHrs} horas`;

        const diffDias = Math.floor(diffHrs / 24);
        if (diffDias === 1) return "Hace 1 día";
        if (diffDias < 7) return `Hace ${diffDias} días`;

        const diffSemanas = Math.floor(diffDias / 7);
        if (diffSemanas === 1) return "Hace 1 semana";
        if (diffDias < 30) return `Hace ${diffSemanas} semanas`;

        const diffMeses = Math.floor(diffDias / 30);
        if (diffMeses === 1) return "Hace 1 mes";
        if (diffDias < 365) return `Hace ${diffMeses} meses`;

        const diffAnios = Math.floor(diffDias / 365);
        return diffAnios === 1 ? "Hace 1 año" : `Hace ${diffAnios} años`;
    }

    if (users.length === 0) {
        return (
            <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500 dark:text-gray-400 italic">
                    No hay usuarios registrados.
                </td>
            </tr>
        );
    }

    return (
        <>
            {/* Itera sobre los usuarios (users) */}
            {users.map((user) => (
                <tr
                    key={user.id}
                    // Fondo de la fila: light-surface/dark-surface. El hover usa dark-elevated o light-elevated
                    className="bg-light-surface dark:bg-dark-surface hover:bg-light-elevated/70 dark:hover:bg-dark-elevated transition-colors duration-200"
                >
                    {/* Celda ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-light-text dark:text-dark-text font-medium text-sm">
                        {user.id}
                    </td>

                    {/* Celda Username con indicador de estado (Online/Offline) */}
                    <td className="px-6 py-4 whitespace-nowrap text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            {/* Username */}
                            <span className="text-light-text dark:text-dark-text font-medium">{user.username}</span>

                            {user.isOnline ? (
                                // Estado Online (usando light-success/dark-success)
                                <span className="flex items-center gap-1 text-light-success dark:text-dark-success text-xs">
                                    <span className="w-2 h-2 rounded-full bg-light-success dark:bg-dark-success animate-pulse" />
                                    Online
                                </span>
                            ) : (
                                // Estado Offline (usando texto secundario)
                                <span className="text-light-text-secondary dark:text-dark-text-secondary/70 text-xs italic">
                                    {user.lastActive ? tiempoDesde(user.lastActive) : "Nunca se ha conectado"}
                                </span>
                            )}
                        </div>
                    </td>

                    {/* Celda Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-light-text-secondary dark:text-dark-text-secondary text-sm">
                        {user.email}
                    </td>

                    {/* Celda Roles (Badge) - Usando light-accent/dark-accent para el badge */}
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-light-accent/10 text-light-accent dark:bg-dark-accent/20 dark:text-dark-accent">
                            {user.roles.join(', ')}
                        </span>
                    </td>

                    {/* Componente de Acciones (Botones de Editar/Eliminar) */}
                    <UserActions
                        user={user}
                        onOpenModal={onOpenModal}
                        onDeleteUser={onDeleteUser}
                    />
                </tr>
            ))}
        </>
    );
};

export default ShowUsers;
