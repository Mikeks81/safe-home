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
        start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        finish TIMESTAMP WITH TIME ZONE,
        name TEXT,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`)
};

exports.down = function(db) {
  return db.dropTable('trips')
};

exports._meta = {
  "version": 1
};
