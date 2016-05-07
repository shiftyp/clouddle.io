'use strict';

const r = require('rethinkdb');

const dbConfig = require('../db-config');

const failure = (err) => new Error(`Database could not be initialized: ${err}`);
const success = () => console.log(`Database ${dbConfig.rethinkdb.db} initialized.`);

const wrapInPromise = (fn) => {
  return function () {
    return new Promise((resolve) => {
      resolve(fn.apply(this, arguments));
    });
  }
};

const connect = wrapInPromise(() => (
	r.connect(dbConfig.rethinkdb)
));

const bindConnect = (fn) => {
  return function() {
    return connect()
      .catch((err) => new Error(`Could not connect to database: ${err}`))
      .then(fn.bind(null, ...arguments));
  };
};

const createDbInterface = bindConnect((io, conn) => {
  return {
    createTables: wrapInPromise(() => (
      r.tableCreate('messages').run(conn)
    )),

    createIndices: wrapInPromise(() => (
      r.table('messages').indexCreate('createdAt').run(conn)
    )),

    initializeTables: wrapInPromise(() => (
      r.table('messages').indexWait('createdAt').run(conn)
    )),

    createDb: wrapInPromise(() => (
      r.dbCreate(dbConfig.rethinkdb.db).run(conn)
    )),

    initializeQueries: wrapInPromise(() => (
      r.table('messages').changes().run(conn, (err, cursor) => {
        if(err) {
          throw new Error(err);
        }
        cursor.each((err, message) => {
          if(err) {
            throw err;
          }
          io.emit('message', message.new_val.text);
        });
      })
    ))
  };
});

const bindDbInterface = (fn) => {
  return function(io) {
    return createDbInterface(io).then(fn);
  };
};

const initialize = bindDbInterface((db) => (
  db.initializeTables()
    .then(success)
    .catch((err) => {
      console.log(`Error initializing tables: ${err}\nTrying db create`);
		})
    .then(db.createDb)
    .catch((err) => {
      console.log(`Error creating DB: ${err}\nTrying to create tables.`);
    })
    .then(db.createTables)
    .then(db.createIndices)
    .catch((err) => {
      console.log(`Error creating Tables ${err}\nTrying to initialize tables`);
    })
    .then(db.initializeTables)
    .then(db.initializeQueries)
    .then(success)
    .catch(failure)
));

const insertMessage = wrapInPromise(bindConnect((userId, msg, conn) => {
	r.table('messages').insert({ 
		userId: msg.userId,
		text: msg.text, 
		createdAt: r.now()
	})
		.run(conn);
}));

module.exports = {
  initialize,
  insertMessage
};
