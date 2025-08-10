import React, { useState, useEffect } from 'react';
import UserService from '../../services/user.service';
import useWebSocket from '../../hooks/useWebSocket';

const UserBoard = () => {
    // Estados del componente
    const [error, setError] = useState(null);             // Mensaje de error
    const [nowTick, setNowTick] = useState(Date.now());
    const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
    const [isOpen, setIsOpen] = useState(false);  // Estado para controlar la visibilidad de la sidebar

    // Escuchar cambios en tiempo real
    useWebSocket(setUsers, setError);

    useEffect(() => {
        const interval = setInterval(() => setNowTick(Date.now()), 60000); // Actualiza el tick cada 60 segundos
        return () => clearInterval(interval);
    }, []);

    // Cargar los usuarios al montar el componente
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                setUsers(response.data); // Suponiendo que el servicio devuelve un array de usuarios
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
            }
        };

        fetchUsers();
    }, []); // Este useEffect solo se ejecutará una vez al montar el componente

    // Función para calcular el tiempo desde la última conexión del usuario
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


    // Función para alternar la visibilidad de la sidebar
    const toggleSidebar = () => {
        setIsOpen(prevState => !prevState);
    };

    // Si hay un error, muestra el mensaje de error
    if (error) {
        return <div className="text-center p-4 text-light-danger dark:text-dark-danger">{error}</div>;
    }

    return (
        <div>
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full w-64 bg-light-bg dark:bg-dark-bg p-4 transition-all transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} animate-fade-in z-50`}
            >
                {/* Botón para abrir/cerrar la sidebar */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 text-3xl text-light-text dark:text-dark-text"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
                {/* Contenido del sidebar */}
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">Usuarios en Línea</h2>
                <ul className="mt-6 space-y-4">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user.id} className="flex items-center justify-between px-4 py-2 text-light-text dark:text-dark-text">
                                <div className="flex items-center gap-2">
                                    <span>{user.name}</span>
                                    {user.isOnline ? (
                                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400 text-xs italic">
                                            {user.lastActive ? tiempoDesde(user.lastActive) : ""}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 dark:text-gray-400">No hay usuarios disponibles</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UserBoard;
