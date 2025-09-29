require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.get('/', (req, res) => {
  res.send('API running...');
});

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    res.json({ tables: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/users', async (req, res) => {
  const { username, email, password_hash } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [username, email, password_hash]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  const { user_id, title, content } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating note');
  }
});

// Get all notes of a user
app.get('/api/notes/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    const result = await pool.query(
      `SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching notes');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
