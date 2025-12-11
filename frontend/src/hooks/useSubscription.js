import { useEffect } from 'react';
import socketService from '../services/socket.service';

const useSubscription = (topic, onMessageReceived) => {
    useEffect(() => {
        if (!topic) {
            return;
        }

        const subscriptionId = socketService.subscribe(topic, onMessageReceived);

        return () => {
            socketService.unsubscribe(subscriptionId);
        };
    }, [topic, onMessageReceived]);
};

export default useSubscription;

