'use strict';

let path = require('path');
//let webpack = require('webpack');
let express = require('express');
//let config = require('../webpack.config');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let connectionHandler = require('./sockets').bind(null, io);

//let compiler = webpack(config);

const PORT = process.env.PORT || 8080;

/*app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true
}));*/

//app.use(require('webpack-hot-middleware')(compiler));

app.use('/assets', express.static('dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

io.on('connection', connectionHandler);

http.listen(PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`App is listening on ${PORT}`);
	}
});
