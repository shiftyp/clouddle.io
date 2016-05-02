'use strict';

let r = require('rethinkdb');
//let rx = require('rxjs');


let dbConfig = require('../db-config');

let initMessage = (name) => `Database ${name} initialized.`;
let errorMessage = (err) => `Database could not be initialized: ${err}`;

let connect = () => (
	r.connect(dbConfig.rethinkdb)
		.error(console.log.bind(console))
);

let wrapConnect = (fn) => {
	return function() {
		return connect().then(fn.bind(null, ...arguments));
	};
};

let createTables = (conn) => (
	r.tableCreate('messages').indexCreate('createdAt').run(conn)
);

let initializeTables = (conn) => (
	r.table('messages').indexWait('createdAt').run(conn)
);

let createDb = (conn) => (
	r.dbCreate(dbConfig.rethinkdb.db).run(conn)
);

let initialize = () => (
	new Promise((resolve, reject) => {
		let rejectWithError = (err) => {
			reject(new Error(errorMessage(err)));
		};

		let resolveWithLog = () => {
			console.log(initMessage(dbConfig.rethinkdb.db));
			resolve();
		};
		
		let createAndInitTables = (conn) => (
			createTables(conn)
				.then(() => {
					initializeTables(conn)
						.then(resolveWithLog)
						.error(rejectWithError)
				})
		);

		connect()
			.then((conn) => {
				initializeTables(conn)
					.then(resolveWithLog)
					.error((err) => {
						console.log(`Error making tables: ${err}\nTrying db create`);
						createDb(conn)
							.then(() => {
								createAndInitTables(conn)
									.error(rejectWithError);
							})
							.error((err) => {
								console.log(`Error creating DB: ${err}\nTrying to create tables.`);
								createAndInitTables(conn)
									.error(rejectWithError);
							});
					});
			})
			.error(rejectWithError);
	})
);

let insertMessage = wrapConnect((msg, conn) => {
	r.table('messages').insert({ 
		text: msg, 
		createdAt: new Date().toString()
	})
		.run(conn)
		.error(console.log.bind(console));
});

module.exports = {
	insertMessage,
	initialize
};
