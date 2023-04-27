import db from './connection.js'
import bcrypt from 'bcrypt'

const deleteMode = process.env.DELETE_MODE

if (deleteMode) {
  db.exec('DROP TABLE IF EXISTS users')
  db.exec('DROP TABLE IF EXISTS sessions')
}

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(15) NOT NULL,
  password VARCHAR(80) NOT NULL,
  is_verified boolean NOT NULL
)`)

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(30) PRIMARY KEY,
  last_signed_in TEXT,
  fk_username VARCHAR(15),
  FOREIGN KEY (fk_username) REFERENCES users (username)
)`)

const hash = await bcrypt.hash('admin', 12)
db.run(`INSERT INTO users (username, password, is_verified) VALUES ('test', ?, true)`, [hash])