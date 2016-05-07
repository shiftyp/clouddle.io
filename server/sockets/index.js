const db = require('../db');
const { bindParseMessage } = require('../utils');

let loggedInUsers = [];
let messages = [];
let userId = 0;

const connectionHandler = (io, socket) => {
	let user = {};


	socket.emit('connection', JSON.stringify({
		messages: messages,
		users: loggedInUsers
	}));

	socket.on('register', (msg) => {
		user.id = userId++;

		console.log('User Connected');

		if (user) {
			loggedInUsers.push(user);
			io.emit('register', user);
		}
		socket.on('disconnect', () => console.log('User Disconnected'));
		socket.on('message', (msg) => {
			db.insertMessage(msg);
		});
	});
};

module.exports = connectionHandler;
