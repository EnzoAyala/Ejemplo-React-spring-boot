import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import AuthService from '../services/auth.service';

const WS_URL = `${window.location.protocol}//${window.location.hostname}:8080/ws`;

const useSubscription = (topic, onMessageReceived) => {
    const stompClient = useRef(null);
    const subscription = useRef(null);

    useEffect(() => {
        if (!topic) {
            return;
        }

        const user = AuthService.getCurrentUser();
        const token = user?.accessToken;

        if (!token) {
            console.error("No autenticado para WebSocket.");
            return;
        }

        const socket = new SockJS(WS_URL);
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null; 

        stompClient.current.connect(
            { Authorization: `Bearer ${token}` },
            () => {
                subscription.current = stompClient.current.subscribe(topic, (message) => {
                    const body = JSON.parse(message.body);
                    onMessageReceived(body);
                });
            },
            (error) => {
                console.error("Error de conexión WebSocket:", error);
            }
        );

        return () => {
            if (subscription.current) {
                subscription.current.unsubscribe();
            }
            if (stompClient.current?.connected) {
                stompClient.current.disconnect(() => {});
            }
        };
    }, [topic, onMessageReceived]);
};

export default useSubscription;
