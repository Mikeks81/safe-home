module.exports = {
  users: 
    `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP DEFAULT NOW()
      )`,
  contacts:
    `CREATE TABLE IF NOT EXISTS
      contacts(
        id SERIAL PRIMARY KEY,
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        owner_id INTEGER NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )`,
  trips:
    `CREATE TABLE IF NOT EXISTS
      trips(
        id SERIAL PRIMARY KEY,
        start TIMESTAMP,
        finished TIMESTAMP,
        name TEXT,
        owner_id INTEGER NOT NULL,
        created_date TIMESTAMP DEFAULT NOW(),
        modified_date TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )`,
  coordinates:
      `CREATE TABLE IF NOT EXISTS
        coordinates(
          id SERIAL PRIMARY KEY,
          time TIMESTAMP,
          lat FLOAT,
          long FLOAT,
          trip_id INTEGER NOT NULL,
          created_date TIMESTAMP DEFAULT NOW(),
          modified_date TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (trip_id) REFERENCES coordinates (id) ON DELETE CASCADE
        )`
}