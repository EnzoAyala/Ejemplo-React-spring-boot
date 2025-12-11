import { useEffect } from 'react';
import socketService from '../services/socket.service';

const useChatWebSocket = (chatId, onMessageReceived) => {

    useEffect(() => {
        if (!chatId) return;

        const subscriptionId = socketService.subscribe(
            `/topic/chat/${chatId}`,
            (message) => {
                onMessageReceived(message);
            }
        );

        return () => {
            socketService.unsubscribe(subscriptionId);
        };
    }, [chatId, onMessageReceived]);

    const sendMessage = (message) => {
        socketService.sendMessage("/app/chat.sendMessage", message);
    };

    return { sendMessage };
};

export default useChatWebSocket;

