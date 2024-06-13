const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 5000;

app.use(bodyParser.json());

// Endpoint untuk membuat catatan baru
app.post('/notes', (req, res) => {
  const { title, datetime, note } = req.body;
  const query = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
  db.query(query, [title, datetime, note], (err, result) => {
    if (err) throw err;
    res.status(201).send({ id: result.insertId, title, datetime, note });
  });
});

// Endpoint untuk menampilkan semua catatan
app.get('/notes', (req, res) => {
  const query = 'SELECT * FROM notes';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
});

// Endpoint untuk menampilkan salah satu catatan
app.get('/notes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM notes WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).send({ message: 'Note not found' });
    }
    res.status(200).json(results[0]);
  });
});

// Endpoint untuk mengubah catatan
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, datetime, note } = req.body;
  const query = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
  db.query(query, [title, datetime, note, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Note not found' });
    }
    res.status(200).send({ id, title, datetime, note });
  });
});

// Endpoint untuk menghapus catatan
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM notes WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Note not found' });
    }
    res.status(200).send({ message: 'Note deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
