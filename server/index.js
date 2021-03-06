'use strict';

let path = require('path');
let express = require('express');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let connectionHandler = require('./sockets').bind(null, io);
let db = require('./db');

const PORT = process.env.PORT || 8080;

app.use('/assets', express.static('../dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

io.on('connection', connectionHandler);

db.initialize(io)
	.then(() => {
		http.listen(PORT, (err) => {
			if (err) {
				 throw new Error(err);
			} else {
				console.log(`App is listening on ${PORT}`);
			}
		});
	})
	.catch((err) => {
		console.log(err.message);
		process.exit(1);
	});
