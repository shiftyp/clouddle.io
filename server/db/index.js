'use strict';

let r = require('rethinkdb');

let dbConfig = require('../db-config');

let initMessage = (name) => `Database ${name} initialized.`;
let errorMessage = (err) => `Database could not be initialized: ${err}`;

let connect = () => (
	r.connect(dbConfig.rethinkdb)
		.error(console.log.bind(console))
);

let createTables = (conn) => (
	r.tableCreate('messages')
);

let createIndices = (conn) => (
	r.table('messages').indexCreate('createdAt').run(conn)
)

let initializeTables = (conn) => (
	r.table('messages').indexWait('createdAt').run(conn)
);

let createDb = (conn) => (
	r.dbCreate(dbConfig.rethinkdb.db).run(conn)
);

let initializeQueries = (conn, io) => {
	r.table('messages').changes().run(conn, (err, cursor) => {
		if (err) {
			throw error;
		}

		cursor.each((err, message) => {
			if (err) {
				throw err;
			}
			io.emit('message', message.text);
		});
		
	});
};

let initialize = (io) => (
	new Promise((resolve, reject) => {
		let rejectWithError = (err) => {
			reject(new Error(errorMessage(err)));
		};

		let resolveWithLog = () => {
			console.log(initMessage(dbConfig.rethinkdb.db));
			resolve();
		};
		
		connect()
			.then((conn) => {
				initializeTables(conn)
					.then(resolveWithLog)
					.error((err) => {
						console.log(`Error initializing tables: ${err}\nTrying db create`);
					})
					.then(() => createDb(conn))
					.error((err) => {
						console.log(`Error creating DB: ${err}\nTrying to create tables.`);
					})
					.then(() => createTables(conn))
					.then(() => createIndices(conn))
					.error((err) => {
						console.log(`Error creating Tables ${err}\nTrying to initialize tables`);
					})
					.then(() => initializeTables(conn))
					.then(() => {
						initializeQueries(conn, io);
						resolveWithLog();
					})
					.error(rejectWithError);
			})
			.error(rejectWithError);
	})
);

let wrapConnect = (fn) => {
	return function() {
		return connect().then(fn.bind(null, ...arguments));
	};
};

let insertMessage = wrapConnect((userId, msg, conn) => {
	r.table('messages').insert({ 
		userId: userId,
		text: msg, 
		createdAt: r.now()
	})
		.run(conn)
		.error(console.log.bind(console));
});

module.exports = {
	insertMessage,
	initialize
};
