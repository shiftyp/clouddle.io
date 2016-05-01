import socket from '../constants/socket';

import { MESSAGE_RECIEVED } from '../constants/action-types';

const recieveMessage = (msg) => {
	return {
		type: MESSAGE_RECIEVED,
		payload: msg
	};
};

export const initializeMessageSockets = () => {
	return (dispatch, _getState) => {
		socket.on('message', (msg) => {
			dispatch(recieveMessage(msg));
		});
	};
};

export const sendMessage = (msg) => {
	return () => {
		socket.emit('message', msg);
	};
};
