import React, { useEffect, useState } from 'react';
import UserActions from './UserActions';

const ShowUsers = ({ users, onOpenModal, onDeleteUser }) => {
    // Tick local para forzar re-render y recalcular tiempo relativo sin refrescar la página
    
    const [nowTick, setNowTick] = useState(Date.now()); // Error de 'nowTick' is not defined
    useEffect(() => {
        const interval = setInterval(() => setNowTick(Date.now()), 60000); // cada 60s
        return () => clearInterval(interval);
    }, []);

    if (users.length === 0) {
        return (
            <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500 dark:text-gray-400 italic">
                    No hay usuarios registrados.
                </td>
            </tr>
        );
    }

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
        return `Hace ${diffHrs} ${diffHrs === 1 ? "hora" : "horas"}`;
    }

    

    return (
        <>
            {users.map((user) => (
                <tr
                    key={user.id}
                    className="bg-light-surface dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100 font-medium">
                        {user.id}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <span>{user.username}</span>
                            {user.online ? (
                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </span>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400 text-xs italic">
                                    {user.lastActive ? tiempoDesde(user.lastActive) : "Nunca se ha conectado"}
                                </span>
                            )}
                        </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                        {user.email}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-800 dark:text-gray-200">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                            {user.roles.join(', ')}
                        </span>
                    </td>

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
