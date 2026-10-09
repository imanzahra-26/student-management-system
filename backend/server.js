// ============================================
// STUDENT MANAGEMENT SYSTEM — BACKEND SERVER
// ============================================

// --------------------------------------------
// SECTION 1: IMPORTS
// --------------------------------------------
// Bring in the packages we installed earlier

import express from 'express';        // Web framework — handles routes & server
import mysql from 'mysql2';           // Lets Node talk to MySQL
import cors from 'cors';              // Allows React (frontend) to call this server tells your server to allow your website to talk to it.
import dotenv from 'dotenv';          // Reads secret values from .env file

// Load the .env file so we can use process.env.PORT, process.env.DB_PASSWORD etc.
dotenv.config();


// --------------------------------------------
// SECTION 2: CONFIG
// --------------------------------------------
// Create the Express app and set basic middleware

const app = express();                // Create the Express application
const PORT = process.env.PORT || 5000;// Use PORT from .env, fallback to 5000

// middleware: automatically parse incoming JSON (so req.body works)
app.use(express.json());

// middleware: allow cross-origin requests (frontend on 5173 → backend on 5000)
app.use(cors());


// --------------------------------------------
// SECTION 3: DATABASE CONNECTION
// --------------------------------------------
// Create a "connection pool" — a set of reusable connections to MySQL

const db = mysql.createPool({
  host:     process.env.DB_HOST,       // e.g. localhost
  user:     process.env.DB_USER,       // e.g. root
  password: process.env.DB_PASSWORD,   // from .env (secret!)
  database: process.env.DB_NAME,       // student_management
  waitForConnections: true,            // queue requests if all connections busy
  connectionLimit: 10,                 // max 10 connections at once
  queueLimit: 0                        // unlimited queue
});

// Quick test: try connecting once when server starts
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection FAILED:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
  connection.release();                // return the connection to the pool
});


// --------------------------------------------
// SECTION 4: TEST ROUTE
// --------------------------------------------
// A simple route so we can confirm the server is alive

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Student Management API is running',
    status: 'ok'
  });
});
// --------------------------------------------
// SECTION 5: STUDENT ROUTES (CRUD)
// --------------------------------------------

// ----------------------------------------------
// ROUTE 1: GET /students  —  Get ALL students
// ----------------------------------------------
app.get('/students', (req, res) => {
  // SQL query to fetch every row from the students table
  const sql = 'SELECT * FROM students ORDER BY id DESC';

  // Run the query using the connection pool
  db.query(sql, (err, results) => {
    // If MySQL returns an error, send a 500 (server error) response
    if (err) {
      console.error('❌ Error fetching students:', err.message);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }

    // Success — send the array of students as JSON
    res.json(results);
  });
});


// ----------------------------------------------
// ROUTE 2: GET /students/:id  —  Get ONE student
// ----------------------------------------------
app.get('/students/:id', (req, res) => {
  // Grab the id from the URL (e.g. /students/5  →  id = 5)
  const studentId = req.params.id;

  // Use "?" placeholder to prevent SQL injection (safe way)
  const sql = 'SELECT * FROM students WHERE id = ?';

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching student:', err.message);
      return res.status(500).json({ error: 'Failed to fetch student' });
    }

    // If results array is empty, no student exists with that id
    if (results.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Success — send the single student object
    res.json(results[0]);
  });
});


// ----------------------------------------------
// ROUTE 3: POST /students  —  Add a NEW student
// ----------------------------------------------
app.post('/students', (req, res) => {
  // Extract data sent by the client (from request body)
  const { name, email, age, course } = req.body;

  // Basic validation — all 4 fields are required
  if (!name || !email || !age || !course) {
    return res.status(400).json({ error: 'All fields are required: name, email, age, course' });
  }

  // SQL query to insert a new student row
  const sql = 'INSERT INTO students (name, email, age, course) VALUES (?, ?, ?, ?)';

  db.query(sql, [name, email, age, course], (err, result) => {
    if (err) {
      console.error('❌ Error adding student:', err.message);
      // 1062 = duplicate email error from MySQL
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'This email is already registered' });
      }
      return res.status(500).json({ error: 'Failed to add student' });
    }

    // Success — send back the new student's id
    res.status(201).json({
      message: '✅ Student added successfully',
      id: result.insertId
    });
  });
});


// ----------------------------------------------
// ROUTE 4: PUT /students/:id  —  UPDATE a student
// ----------------------------------------------
app.put('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const { name, email, age, course } = req.body;

  // Basic validation
  if (!name || !email || !age || !course) {
    return res.status(400).json({ error: 'All fields are required: name, email, age, course' });
  }

  // Update the row where id matches
  const sql = 'UPDATE students SET name = ?, email = ?, age = ?, course = ? WHERE id = ?';

  db.query(sql, [name, email, age, course, studentId], (err, result) => {
    if (err) {
      console.error('❌ Error updating student:', err.message);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'This email is already used by another student' });
      }
      return res.status(500).json({ error: 'Failed to update student' });
    }

    // If affectedRows is 0, no student with that id existed
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: '✅ Student updated successfully' });
  });
});


// ----------------------------------------------
// ROUTE 5: DELETE /students/:id  —  DELETE a student
// ----------------------------------------------
app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;

  const sql = 'DELETE FROM students WHERE id = ?';

  db.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error('❌ Error deleting student:', err.message);
      return res.status(500).json({ error: 'Failed to delete student' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: '✅ Student deleted successfully' });
  });
});


// --------------------------------------------
// SECTION 6: START THE SERVER
// --------------------------------------------
// Tell Express to start listening on PORT

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});