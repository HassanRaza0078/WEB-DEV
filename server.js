require("dotenv").config();
const express = require("express");
const path = require("path");
const { openDb } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Contact API endpoint
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ success: false, error: "All fields required" });

  const db = openDb();
  const stmt = db.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
  stmt.run(name, email, message, function (err) {
    stmt.finalize();
    db.close();
    if (err) return res.status(500).json({ success: false, error: "DB error" });
    res.json({ success: true, id: this.lastID });
  });
});

// View saved contacts (for testing)
app.get("/admin/contacts", async (req, res) => {
  const db = openDb();
  db.all("SELECT * FROM contacts ORDER BY created_at DESC", [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
