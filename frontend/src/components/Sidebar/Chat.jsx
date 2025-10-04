import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatSidebar from './chatSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';
import MessageService from '../../services/message.service';
import AuthService from '../../services/auth.service';
import useChatWebSocket from '../../hooks/useChatWebSocket';
import { NavLink } from 'react-router-dom';

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [nowTick, setNowTick] = useState(Date.now());
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        // Focus input when a user is selected and sidebar is closed
        if (!isSidebarOpen && selectedUser) {
            // Timeout to wait for sidebar closing animation
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 300); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [isSidebarOpen, selectedUser]);

    const computeChatId = (id1, id2) => {
        if (!id1 || !id2) return null;
        return id1 < id2 ? `chat_${id1}_${id2}` : `chat_${id2}_${id1}`;
    };

    const chatId = computeChatId(currentUser?.id, selectedUser?.id);

    const handleNewMessage = useCallback((newMessage) => {
        setMessages((prevMessages) => {
            // Evitar duplicados
            if (prevMessages.some((msg) => msg.id === newMessage.id)) {
                return prevMessages;
            }
            return [...prevMessages, newMessage];
        });
    }, []);

    const { sendMessage } = useChatWebSocket(chatId, handleNewMessage);


    useEffect(() => {
        const interval = setInterval(() => setNowTick(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Cargar conversación al seleccionar usuario
    useEffect(() => {
        const fetchConversation = async () => {
            if (!selectedUser || !currentUser?.id) {
                setMessages([]);
                return;
            }
            try {
                const { data } = await MessageService.getConversation(currentUser.id, selectedUser.id);
                setMessages(Array.isArray(data) ? data : []);
                // marcar como leídos los mensajes recibidos por el usuario actual
                await MessageService.markAsRead(currentUser.id, selectedUser.id, currentUser.id);
            } catch (e) {
                console.error('Error al cargar la conversación:', e);
                setMessages([]);
            }
        };
        fetchConversation();
    }, [selectedUser, currentUser?.id]);

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

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedUser || !currentUser?.id) return;

        const payload = {
            emisorId: currentUser.id,
            receptorId: selectedUser.id,
            contenido: input.trim(),
            chatId: chatId,
        };

        sendMessage(payload);
        setInput('');
    };

    // Auto scroll al final cuando cambian los mensajes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex items-center justify-center max-h-screen bg-light-background dark:bg-dark-background p-4 animate-gradient-pulse" >
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
                            <header className="p-4 border-b border-light-divider dark:border-dark-divider shadow-sm flex justify-between items-center">
                                <div className="flex-1"></div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={selectedUser.profilePictureUrl ? `${window.location.protocol}//${window.location.hostname}:8080/uploads/${selectedUser.profilePictureUrl}` : (selectedUser.gender === 'MALE' ? 'https://th.bing.com/th/id/OIP.eJ4BA7hzUGjKZ0qUEfAgVQHaHa?o=7&rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' : 'https://logowik.com/content/uploads/images/woman4906.jpg')}
                                            alt={selectedUser.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        {selectedUser.isOnline && (
                                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-light-surface dark:border-dark-surface" />
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-light-text dark:text-dark-text">{selectedUser.name}</span>
                                        <p className={`text-sm ${selectedUser.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {selectedUser.isOnline ? "En línea" : (selectedUser.lastActive ? tiempoDesde(selectedUser.lastActive) : "Desconectado")}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex-1 flex justify-end'>
                                    <NavLink
                                        to="/user_perfil"
                                        className='px-4 py-2 sm:px-6 sm:py-2 bg-blue-400 dark:bg-blue-800 text-white font-medium rounded-md hover:bg-blue-500 dark:hover:bg-blue-900 transition'
                                    >
                                        Ir a Perfil
                                    </NavLink>
                                </div>
                            </header>

                            {/* Historial */}
                            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto">
                                {messages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-center text-light-text-secondary dark:text-dark-text-secondary">
                                        Historial de chat con {selectedUser.name}...
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {messages.map((m) => {
                                            const isMine = m.emisorId === currentUser?.id;
                                            return (
                                                <li key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-xs md:max-w-md px-3 py-2 rounded-lg shadow text-sm ${isMine ? 'bg-blue-500 text-white' : 'bg-light-hover dark:bg-dark-hover text-light-text dark:text-dark-text'}`}>
                                                        <div>{m.contenido}</div>
                                                        <div className="text-[10px] opacity-70 mt-1 text-right">{tiempoDesde(m.fecha)}</div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            {/* Input de mensaje */}
                            <footer className="p-4 border-t border-light-divider dark:border-dark-divider">
                                <form onSubmit={handleSend} className="flex justify-center items-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Escribe un mensaje..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="w-full max-w-2xl p-2 rounded-lg bg-light-hover dark:bg-dark-hover border border-light-divider dark:border-dark-divider focus:outline-none focus:ring-2 text-ligth-text dark:text-dark-text bg-light-bg dark:bg-dark-bg"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !input.trim()}
                                        className="ml-4 text-light-text dark:text-dark-text disabled:opacity-50"
                                        aria-label="Enviar"
                                        title="Enviar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                        </svg>
                                    </button>
                                </form>
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
