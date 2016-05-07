import socket from '../constants/socket';
import lock from '../constants/lock';
import { initializeMessageSockets } from './message-actions';

export const initializeIndex = (nextState, replaceState) => {
	return (dispatch, getState) => {
		if (getIdToken) {
			socket.emit('register');
			dispatch(initializeMessageSockets());
		} else {
			window.location.href = '/login';
		}
	};
};	

export const tearDownIndex = (nextState, replaceState) => {
	return (dispatch, getState) => {
		socket.emit('disconnect');
		dispatch(tearDownMessageSockets());
	};
};

export const initializeLogin = (nextState, replaceState) => {
	return () => {
		if (getIdToken()) {
			window.location.href = '/';
		}
	}
};

export const getIdToken = () => {
	var idToken = localStorage.getItem('userToken');
	var authHash = lock.parseHash(window.location.hash);
	if (!idToken && authHash) {
		if (authHash.id_token) {
			idToken = authHash.id_token
			localStorage.setItem('userToken', authHash.id_token);
		}
		if (authHash.error) {
			console.log("Error signing in", authHash);
			return null;
		}
	}
	return idToken;
};
