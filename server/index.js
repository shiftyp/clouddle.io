'use strict';

let express = require('express');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let connectionHandler = require('./sockets').bind(null, io);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

io.on('connection', connectionHandler);

http.listen(PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`App is listening on ${PORT}`);
	}
});
