import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import AuthService from '../services/auth.service';

const WS_URL = `${window.location.protocol}//${window.location.hostname}:8080/ws`;

const useChatWebSocket = (chatId, onMessageReceived) => {
    const stompClient = useRef(null);
    const subscription = useRef(null);

    useEffect(() => {
        if (!chatId) return;

        const user = AuthService.getCurrentUser();
        const token = user?.accessToken;

        if (!token) {
            console.error("No autenticado.");
            return;
        }

        const socket = new SockJS(WS_URL);
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null;

        stompClient.current.connect(
            { Authorization: `Bearer ${token}` },
            () => {
                if (subscription.current) {
                    subscription.current.unsubscribe();
                }
                subscription.current = stompClient.current.subscribe(`/topic/chat/${chatId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    onMessageReceived(receivedMessage);
                });
            },
            (error) => {
                console.error("Error de WebSocket:", error);
            }
        );

        return () => {
            if (stompClient.current?.connected) {
                stompClient.current.disconnect(() => {});
            }
        };
    }, [chatId, onMessageReceived]);

    const sendMessage = (message) => {
        if (stompClient.current?.connected) {
            stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(message));
        }
    };

    return { sendMessage };
};

export default useChatWebSocket;
