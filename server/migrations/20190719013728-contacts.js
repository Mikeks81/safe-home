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
      contacts(
        id SERIAL PRIMARY KEY,
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`
  )
};

exports.down = function(db) {
  return db.dropTable('contacts')
};

exports._meta = {
  "version": 1
};
