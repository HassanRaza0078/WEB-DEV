const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "data.db");
const MIGRATION = fs.readFileSync(path.join(__dirname, "migrations", "init.sql"), "utf8");

function openDb() {
  return new sqlite3.Database(DB_PATH);
}

function init() {
  const db = openDb();
  db.exec(MIGRATION, (err) => {
    if (err) console.error("Error creating DB:", err);
    else console.log("✅ Database initialized successfully");
    db.close();
  });
}

if (process.argv[2] === "--init") init();

module.exports = { openDb };
