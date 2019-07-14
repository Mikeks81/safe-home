module.exports = {
  users: 
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
  contacts:
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
      )`
}