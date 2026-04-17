import sqlite3 from "sqlite3"
import dotenv from "dotenv"

dotenv.config({ path: "../.env" })

const db = new sqlite3.Database('./calendar.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
})

export default db;