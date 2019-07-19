'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`CREATE TABLE IF NOT EXISTS
      trips(
        id SERIAL PRIMARY KEY,
        start TIMESTAMP,
        finished TIMESTAMP,
        name TEXT,
        owner_id INTEGER NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )`)
};

exports.down = function(db) {
  return db.dropTable('trips')
};

exports._meta = {
  "version": 1
};
