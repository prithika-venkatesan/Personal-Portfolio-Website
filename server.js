
const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// Create or open the database file
const db = new Database(path.join(__dirname, "portfolio.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

// Test API
app.get("/api", (req, res) => {
    res.json({
        message: "My Portfolio Backend is Working!"
    });
});

// Receive and save contact messages
app.post("/api/contact", (req, res) => {
    console.log("CONTACT API REACHED!");
    const { name, email, message } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof email !== "string" || !email.trim() ||
        typeof message !== "string" || !message.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        });
    }

    try {
        const insert = db.prepare(`
            INSERT INTO messages (name, email, message)
            VALUES (?, ?, ?)
        `);

        insert.run(name.trim(), email.trim(), message.trim());

        console.log("Contact message saved to database!");

        res.json({
            success: true,
            message: `Thank you, ${name.trim()}! Your message was saved successfully.`
        });
    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Could not save your message. Please try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

