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
        coordinates(
          id SERIAL PRIMARY KEY,
          time TIMESTAMP,
          lat FLOAT,
          long FLOAT,
          trip_id INTEGER NOT NULL,
          created_date TIMESTAMP DEFAULT NOW(),
          modified_date TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (trip_id) REFERENCES coordinates (id) ON DELETE CASCADE
        )`)
};

exports.down = function(db) {
  return db.dropTable('coordinates')
};

exports._meta = {
  "version": 1
};
