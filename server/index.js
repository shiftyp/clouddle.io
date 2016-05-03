'use strict';

let express = require('express');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let connectionHandler = require('./sockets').bind(null, io);

const PORT = process.env.PORT || 8080;

let db = require('./db');

app.use('/assets', express.static('dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

io.on('connection', connectionHandler);

db.initialize(io)
	.then(() => {
		http.listen(PORT, (err) => {
			if (err) {
				 throw err;
			} else {
				console.log(`App is listening on ${PORT}`);
			}
		});
	})
	.catch((err) => {
		throw err
	});
