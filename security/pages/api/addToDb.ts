import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';

// Connect to a SQLite database file named 'test.db'
let db = new sqlite3.Database('accounts.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Define the types for better type checking
type Callback = (err: Error | null, id?: number) => void;

// Function to insert an account into the database
function insertAccount(username: string, password: string, callback: Callback): void {
    // Open the database
    let db = new sqlite3.Database('./accounts.db', (err: Error | null) => {
        if (err) {
            callback(err);
            return;
        }
        console.log('Connected to the database.');
    });

    // Insert the account record
    db.run(`INSERT INTO account (username, password) VALUES (?, ?)`, [username, password], function (this: sqlite3.RunResult, err: Error | null) {
        if (err) {
            callback(err);
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            callback(null, this.lastID);
        }
    });

    // Close the database
    db.close((err: Error | null) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        console.log(username + ":" + password);
        res.status(200).json({ message: 'Signup insertion received' });

        insertAccount(username, password, (err, id) => {
            if (err) {
                console.error('Error:', err.message);
            } else {
                console.log('Insert successful, row ID:', id);
            }
        });
        
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
