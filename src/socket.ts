import { io } from 'socket.io-client';
import { ref } from 'vue';

const URL = import.meta.env.VITE_APP_SOCKET_URL;

export const socketState = ref({
	connected: false,
});

export const socket = io(URL, {
	extraHeaders: {
		token: localStorage.getItem('token') || '',
	},
});

socket.on('connect', () => {
	console.debug('Connected to server');
	socketState.value.connected = true;
});
