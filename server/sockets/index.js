'use strict';

let db = require('../db');

let loggedInUsers = [];
let messages = [];

let connectionHandler = (io, socket) => {
	console.log('User Connected');

	socket.emit('connection', JSON.stringify({
		messages: messages,
		users: loggedInUsers
	}));

	socket.on('register', (msg) => {
		let user = null;

		try {
			user = JSON.parse(msg);
		} catch (error) {
			console.log(error.message);
		}
		
		if (user) {
			loggedInUsers.push(user);
			io.emit('register', user);
		}
	});
	socket.on('disconnect', () => console.log('User Disconnected'));
	socket.on('message', (msg) => {
		io.emit('message', msg);
	});
};

module.exports = connectionHandler;
