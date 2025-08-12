import React, { useState, useEffect, useMemo } from 'react';
import UserService from '../../services/user.service';
import useWebSocket from '../../hooks/useWebSocket';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ChatSidebar = ({ onSelectUser, selectedUser, setSidebarOpen }) => {
    const [error, setError] = useState(null);
    const [nowTick, setNowTick] = useState(Date.now());
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => (u.name || '').toLowerCase().includes(q));
    }, [users, query]);

    useWebSocket(setUsers, setError);

    useEffect(() => {
        const interval = setInterval(() => setNowTick(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
            }
        };
        fetchUsers();
    }, []);

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

    if (error) {
        return <div className="text-center p-4 text-light-danger dark:text-dark-danger">{error}</div>;
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header del sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-light-divider dark:border-dark-divider">
                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                    Chats
                </h2>
                {/* Botón cerrar sidebar */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-danger dark:hover:text-dark-danger"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Buscador */}
            <div className="p-3 border-b border-light-divider dark:border-dark-divider">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar usuario..."
                        aria-label="Buscar usuario"
                        className="w-full pl-10 pr-3 py-2 rounded-md bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary border border-light-divider dark:border-dark-divider focus:outline-none focus:ring-2"
                    />
                </div>
            </div>

            {/* Lista de usuarios */}
            <ul className="flex-1 overflow-y-auto space-y-1 p-2">
                {users.length > 0 ? (
                    filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => onSelectUser(user)}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors
                                    ${selectedUser && selectedUser.id === user.id
                                        ? 'bg-light-primary/20 dark:bg-dark-primary/30'
                                        : 'hover:bg-light-hover dark:hover:bg-dark-hover'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt={user.name} className="w-10 h-10 rounded-full" />
                                        {user.isOnline && (
                                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-light-surface dark:border-dark-surface" />
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-light-text dark:text-dark-text">{user.name}</span>
                                        <p className={`text-sm ${user.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {user.isOnline ? "En línea" : (user.lastActive ? tiempoDesde(user.lastActive) : "Desconectado")}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 text-center text-light-text-secondary dark:text-dark-text-secondary">
                            Sin resultados
                        </li>
                    )
                ) : (
                    <li className="p-4 text-center text-light-text-secondary dark:text-dark-text-secondary">
                        No hay usuarios disponibles
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ChatSidebar;
