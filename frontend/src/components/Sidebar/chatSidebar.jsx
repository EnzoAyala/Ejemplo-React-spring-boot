import React, { useEffect, useMemo, useState } from 'react';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import MessageService from '../../services/message.service';
import useWebSocket from '../../hooks/useWebSocket';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import socketService from '../../services/socket.service';

const ChatSidebar = ({ onSelectUser, selectedUser, setSidebarOpen }) => {
    const [error, setError] = useState(null);
    const [nowTick, setNowTick] = useState(Date.now());
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');

    // Meta por chat por usuario: { [userId]: { lastMessage, lastDate, lastSenderId, unreadCount } }
    const [chatMeta, setChatMeta] = useState({});
    
    const current = AuthService.getCurrentUser();
    const selfId = current?.id;
    const selfUsername = current?.username;

    // Mantener usuarios actualizados (online, nuevos, etc.)
    useWebSocket(setUsers, setError);

    // Tick para tiempo relativo
    useEffect(() => {
        const interval = setInterval(() => setNowTick(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Cargar usuarios inicialmente
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

    // Utilidad: id de chat estable a partir de 2 ids
    const computeChatId = (id1, id2) => {
        if (!id1 || !id2) return null;
        return id1 < id2 ? `chat_${id1}_${id2}` : `chat_${id2}_${id1}`;
    };

    // Obtener meta (último mensaje y no leídos) para cada usuario
    useEffect(() => {
        if (!selfId || !Array.isArray(users) || users.length === 0) return;
        const targets = users.filter(u => u.id !== selfId && u.username !== selfUsername);

        let cancelled = false;
        const loadMeta = async () => {
            try {
                const results = await Promise.all(targets.map(async (u) => {
                    try {
                        const { data } = await MessageService.getConversation(selfId, u.id);
                        const last = Array.isArray(data) && data.length > 0 ? data[data.length - 1] : null;
                        const unreadCount = Array.isArray(data)
                            ? data.filter(m => m.receptorId === selfId && !m.status).length
                            : 0;
                        return [u.id, last ? {
                            lastMessage: last.contenido,
                            lastDate: last.fecha,
                            lastSenderId: last.emisorId,
                            unreadCount,
                        } : {
                            lastMessage: null,
                            lastDate: null,
                            lastSenderId: null,
                            unreadCount: 0,
                        }];
                    } catch (e) {
                        console.warn('No se pudo cargar conversación para usuario', u.id, e);
                        return [u.id, { lastMessage: null, lastDate: null, lastSenderId: null, unreadCount: 0 }];
                    }
                }));

                if (cancelled) return;
                setChatMeta(prev => {
                    const next = { ...prev };
                    results.forEach(([id, meta]) => { next[id] = meta; });
                    return next;
                });
            } catch (e) {
                console.error('Error al cargar meta de chats:', e);
            }
        };

        loadMeta();
        return () => { cancelled = true; };
    }, [users, selfId, selfUsername]);

    // Gestionar suscripciones por usuario (añadir/quitar sin reconectar)
    useEffect(() => {
        if (!selfId || !Array.isArray(users) || users.length === 0) return;

        const subscriptionIds = [];

        users.forEach(u => {
            if (!u?.id || u.id === selfId) return;
            const chatId = computeChatId(selfId, u.id);
            if (chatId) {
                const subId = socketService.subscribe(`/topic/chat/${chatId}`, (payload) => {
                    const otherUserId = payload.emisorId === selfId ? payload.receptorId : payload.emisorId;

                    setChatMeta(prev => {
                        const curr = prev[otherUserId] || { unreadCount: 0 };
                        const isIncoming = payload.receptorId === selfId; // mensaje para mí
                        const nextUnread = isIncoming && !payload.status ? (curr.unreadCount || 0) + 1 : curr.unreadCount || 0;
                        return {
                            ...prev,
                            [otherUserId]: {
                                lastMessage: payload.contenido,
                                lastDate: payload.fecha,
                                lastSenderId: payload.emisorId,
                                unreadCount: nextUnread,
                            }
                        };
                    });
                });
                subscriptionIds.push(subId);
            }
        });

        // Desuscribir de todos los chats al limpiar
        return () => {
            subscriptionIds.forEach(id => socketService.unsubscribe(id));
        };
    }, [users, selfId]);

    // Filtro por búsqueda y orden por última actividad de chat (último mensaje)
    const filteredUsers = useMemo(() => {
        const list = Array.isArray(users) ? users : [];
        const base = list.filter((u) => u.id !== selfId && u.username !== selfUsername);
        const q = query.trim().toLowerCase();
        const filtered = q ? base.filter((u) => (u.name || '').toLowerCase().includes(q)) : base;
        // Ordenar por lastDate desc; usuarios sin lastDate al final
        const sorted = [...filtered].sort((a, b) => {
            const aMeta = chatMeta[a.id];
            const bMeta = chatMeta[b.id];
            const aTime = aMeta?.lastDate ? new Date(aMeta.lastDate).getTime() : 0;
            const bTime = bMeta?.lastDate ? new Date(bMeta.lastDate).getTime() : 0;
            if (aTime === bTime) return (a.name || '').localeCompare(b.name || '');
            return bTime - aTime;
        });
        return sorted;
    }, [users, query, selfId, selfUsername, chatMeta]);

    // Cuando se selecciona un usuario, limpiar badge de no leídos para ese usuario (optimista)
    useEffect(() => {
        if (!selectedUser?.id) return;
        setChatMeta(prev => ({
            ...prev,
            [selectedUser.id]: {
                ...(prev[selectedUser.id] || {}),
                unreadCount: 0,
            }
        }));
    }, [selectedUser?.id]);

    function tiempoDesde(fechaISO) {
        if (!fechaISO) return '';
        const fecha = new Date(fechaISO);
        const ahora = new Date(nowTick);
        const diffMs = ahora - fecha;
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return 'Hace un momento';
        if (diffMin === 1) return 'Hace 1 minuto';
        if (diffMin < 60) return `Hace ${diffMin} minutos`;

        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs === 1) return 'Hace 1 hora';
        if (diffHrs < 24) return `Hace ${diffHrs} horas`;

        const diffDias = Math.floor(diffHrs / 24);
        if (diffDias === 1) return 'Hace 1 día';
        if (diffDias < 7) return `Hace ${diffDias} días`;

        const diffSemanas = Math.floor(diffDias / 7);
        if (diffSemanas === 1) return 'Hace 1 semana';
        if (diffDias < 30) return `Hace ${diffSemanas} semanas`;

        const diffMeses = Math.floor(diffDias / 30);
        if (diffMeses === 1) return 'Hace 1 mes';
        if (diffDias < 365) return `Hace ${diffMeses} meses`;

        const diffAnios = Math.floor(diffDias / 365);
        return diffAnios === 1 ? 'Hace 1 año' : `Hace ${diffAnios} años`;
    }

    if (error) {
        return <div className="text-center p-4 text-light-danger dark:text-dark-danger">{error}</div>;
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header del sidebar */}
            <div className="flex items-center justify-between p-6 border-b border-light-divider dark:border-dark-divider">
                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Chats</h2>
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
                        filteredUsers.map((user) => {
                            const meta = chatMeta[user.id] || {};
                            const lastMsg = meta.lastMessage;
                            const lastTime = meta.lastDate;
                            const lastSenderId = meta.lastSenderId;
                            const unread = meta.unreadCount || 0;
                            const isSelected = selectedUser && selectedUser.id === user.id;

                            let preview = '';
                            if (lastMsg) {
                                preview = (lastSenderId === selfId ? 'Tú: ' : '') + lastMsg;
                                if (preview.length > 50) preview = preview.slice(0, 50) + '…';
                            }

                            return (
                                <li
                                    key={user.id}
                                    onClick={() => { onSelectUser(user); setSidebarOpen(false); }}
                                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-light-primary/20 dark:bg-dark-primary/30' : 'hover:bg-light-hover dark:hover:bg-dark-hover'}`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="relative shrink-0">
                                            <img
                                                src={user.profilePictureUrl ? `https://worksyncback.onrender.com/uploads/${user.profilePictureUrl}` : (user.gender === 'MALE' ? 'https://th.bing.com/th/id/OIP.eJ4BA7hzUGjKZ0qUEfAgVQHaHa?o=7&rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' : 'https://logowik.com/content/uploads/images/woman4906.jpg')}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            {user.isOnline && (
                                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-light-surface dark:border-dark-surface" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span className="font-semibold text-light-text dark:text-dark-text truncate">{user.name}</span>
                                                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary shrink-0">
                                                    {lastTime ? tiempoDesde(lastTime) : (user.isOnline ? 'En línea' : (user.lastActive ? tiempoDesde(user.lastActive) : 'Desconectado'))}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <p className={`text-sm truncate ${unread > 0 ? 'text-light-text dark:text-dark-text' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {lastMsg ? preview : (user.isOnline ? 'Disponible' : 'Sin mensajes')}
                                                </p>
                                                {unread > 0 && (
                                                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold min-w-5 h-5 px-1">
                                                        {unread > 99 ? '99+' : unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })
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

