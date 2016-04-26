'use strict';

let r = require('rethinkdb');

let dbConfig = require('../db-config');

let connect = () => (
	r.connect(dbConfig.rethinkdb)
		.error(console.log.bind(console))
);

let wrapConnect = (fn) => {
	return function() {
		connect().then(fn.bind(null, ...arguments));
	};
};

let initialize = wrapConnect((callback, conn) => {
	r.table('messages').indexWait('createdAt').run(conn).then(function() {
		console.log("Table and index are available, starting express...");
		callback();
	}).error(function(err) {
		console.log(`Unable to connect to RethinkDB: ${err}. Exiting.`);
		process.exit(1);
	});
});

let insertMessage = wrapConnect((msg, conn) => {
	r.table('messages').insert({ 
		text: msg, 
		createdAt: new Date().toString()
	})
		.run(conn)
		.error(console.log.bind(console));
});

module.exports = {
	insertMessage
};
