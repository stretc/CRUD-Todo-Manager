const express = require("express");
const cors = require("cors");
const app = express();
const port = 8800;

app.use(express.json());
app.use(cors());

// Configuring MySQL server
const mysql = require("mysql");
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'taskdb',
});

// Starts Connection to DB
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

// Reads Data
app.get('/tasks', (req, res) => {
  const q = 'SELECT * FROM todo';
  db.query(q, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// Creates Data
app.post('/tasks', (req, res) => {
  const { title, date, description } = req.body;
  const q = 'INSERT INTO todo (title, date, description) VALUES (?, ?, ?)';
  db.query(q, [title, date, description], (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

app.get('/update/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM todo WHERE id = ?', id, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send(result);
  });
});

// Updates Data
app.put('/tasks/:id', (req, res) => {
  const { title, date, description } = req.body;
  const { id } = req.params;
  const q = 'UPDATE todo SET title = ?, date = ?, description = ? WHERE id = ?';
  db.query(q, [title, date, description, id], (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// Deletes Data
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const q = 'DELETE FROM todo WHERE id = ?';
  db.query(q, [id], (err, data) => {
    if (err) throw err;
    res.send('Todo Delete Successful!');
  });
});

app.listen(port, () => {
  console.log(`Backend Connected : ${port}`);
});