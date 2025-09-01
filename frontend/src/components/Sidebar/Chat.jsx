import React, { useState, useEffect } from 'react';
import ChatSidebar from './chatSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [nowTick, setNowTick] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNowTick(Date.now()), 60000);
        return () => clearInterval(interval);
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

    return (
        <div className="flex items-center justify-center max-h-screen bg-light-background dark:bg-dark-background p-4">
            <div className="relative flex h-[calc(80vh-2rem)] w-full max-w-6xl rounded-lg shadow-lg overflow-hidden bg-light-surface dark:bg-dark-surface">                
                {/* Sidebar */}
                <aside 
                    className={`absolute top-0 left-0 z-20 w-80 h-full bg-light-surface dark:bg-dark-surface shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-full overflow-y-auto">
                        <ChatSidebar
                            onSelectUser={setSelectedUser}
                            selectedUser={selectedUser}
                            setSidebarOpen={setSidebarOpen}
                        />
                    </div>
                </aside>

                {/* Main */}
                <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>

                    {/* Botón para abrir Sidebar */}
                    {!isSidebarOpen && (
                        <button
                            className="absolute top-4 left-4 z-30 text-light-text dark:text-dark-text"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Bars3Icon className="h-8 w-8" />
                        </button>
                    )}

                    {selectedUser ? (
                        <div className="flex flex-col h-full bg-light-background dark:bg-dark-background">
                            {/* Header del chat */}
                            <header className="p-4 border-b border-light-divider dark:border-dark-divider shadow-sm flex justify-center">
                                <div className="flex flex-col items-center">
                                    <span className="font-semibold text-light-text dark:text-dark-text">
                                        {selectedUser.name}
                                    </span>
                                    <p
                                        className={`text-sm ${selectedUser.isOnline
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {selectedUser.isOnline
                                            ? "En línea"
                                            : (selectedUser.lastActive
                                                ? tiempoDesde(selectedUser.lastActive)
                                                : "Desconectado")}
                                    </p>
                                </div>
                            </header>

                            {/* Historial */}
                            <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
                                <div className="text-center text-light-text-secondary dark:text-dark-text-secondary">
                                    Historial de chat con {selectedUser.name}...
                                </div>
                            </div>

                            {/* Input de mensaje */}
                            <footer className="p-4 border-t border-light-divider dark:border-dark-divider flex justify-center">
                                <input
                                    type="text"
                                    placeholder="Escribe un mensaje..."
                                    className="w-full max-w-2xl p-2 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-divider dark:border-dark-divider focus:outline-none focus:ring-2 text-ligth-text dark:text-dark-text bg-light-bg dark:bg-dark-bg"
                                />
                                <button type='submit' className="ml-4 text-light-text dark:text-dark-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                    </svg>

                                </button>

                            </footer>
                        </div>
                    ) : (
                        // Pantalla de bienvenida
                        <div className="flex flex-col items-center justify-center flex-1 text-center p-6 bg-light-background dark:bg-dark-background">
                            <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary">
                                Bienvenido al Chat
                            </h1>
                            <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary max-w-md">
                                Selecciona un usuario de la lista para comenzar a chatear.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Chat;
