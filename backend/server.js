const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

// Create tables on startup
const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES students(id),
                course_id INTEGER REFERENCES courses(id),
                UNIQUE(student_id, course_id)
            );
        `);
        // Insert some sample courses
        await pool.query(`
            INSERT INTO courses (name, description) VALUES
            ('Mathematics', 'Basic mathematics course'),
            ('Science', 'Introduction to science'),
            ('History', 'World history overview')
            ON CONFLICT (name) DO NOTHING;
        `);
        console.log('Tables created and sample data inserted');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

createTables();

app.get('/', (req, res) => {
    res.send("Backend is running!");
});

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Register a new student
app.post('/register-student', async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Get all courses
app.get('/courses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM courses');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register a student for a course
app.post('/register-course', async (req, res) => {
    const { studentId, courseId } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO registrations (student_id, course_id) VALUES ($1, $2) RETURNING *',
            [studentId, courseId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            res.status(400).json({ error: 'Student already registered for this course' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
