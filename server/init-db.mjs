import db from "./database.mjs"

db.run(`CREATE TABLE IF NOT EXISTS dates (
    date TEXT PRIMARY KEY,
    color TEXT,
    note TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Table created or already exists');
    }

    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
    })
})
