
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { getAuthToken } from './auth.service'; // Asumimos que tienes una forma de obtener el token

const WS_URL = 'http://localhost:8080/ws';

let stompClient = null;
let connectionPromise = null;
const subscribers = new Map();

const connect = () => {
    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = new Promise((resolve, reject) => {
        const token = getAuthToken();
        if (!token) {
            console.error('Socket Service: No auth token found.');
            return reject('No auth token found.');
        }

        const socket = new SockJS(WS_URL);
        stompClient = Stomp.over(socket);
        stompClient.debug = null; // Desactivar logs en producción

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        stompClient.connect(
            headers,
            () => {
                console.log('Socket Service: Connected to WebSocket.');
                resolve();
            },
            (error) => {
                console.error('Socket Service: Connection error.', error);
                connectionPromise = null; // Permitir reintentos
                reject(error);
            }
        );
    });

    return connectionPromise;
};

const disconnect = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log('Socket Service: Disconnected.');
        });
    }
    stompClient = null;
    connectionPromise = null;
    subscribers.clear();
};

const subscribe = (topic, callback) => {
    const subscriptionId = `sub-${Date.now()}`;
    
    connect().then(() => {
        const subscription = stompClient.subscribe(topic, (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                callback(parsedMessage);
            } catch (error) {
                console.error(`Socket Service: Error parsing message for topic ${topic}`, error);
                callback(message.body); // Fallback to raw body
            }
        });

        subscribers.set(subscriptionId, { topic, subscription });
        console.log(`Socket Service: Subscribed to ${topic}`);

    }).catch(error => {
        console.error(`Socket Service: Failed to subscribe to ${topic}`, error);
    });

    return subscriptionId;
};

const unsubscribe = (subscriptionId) => {
    if (subscribers.has(subscriptionId)) {
        const { subscription } = subscribers.get(subscriptionId);
        subscription.unsubscribe();
        subscribers.delete(subscriptionId);
        console.log(`Socket Service: Unsubscribed from ${subscriptionId}`);
    }
};

const sendMessage = (destination, body) => {
    connect().then(() => {
        stompClient.send(destination, {}, JSON.stringify(body));
    }).catch(error => {
        console.error(`Socket Service: Failed to send message to ${destination}`, error);
    });
};


const socketService = {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
};

export default socketService;
