const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend API is running smoothly!' });
});

// GET /api/skills - Fetch from PostgreSQL
app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY id');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch skills' });
  }
});

// GET /api/projects - Fetch from PostgreSQL
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

// POST /api/contact - Save message to PostgreSQL
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required.' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email format.' 
    });
  }

  try {
    const queryText = `
      INSERT INTO messages (name, email, message) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const { rows } = await pool.query(queryText, [name, email, message]);
    
    console.log('📬 New message saved:', rows[0]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!', 
      data: rows[0] 
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save message. Please try again.' 
    });
  }
});

// GET /api/messages - View all messages (admin/debug)
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Contact endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`🔗 Skills: http://localhost:${PORT}/api/skills`);
  console.log(`📁 Projects: http://localhost:${PORT}/api/projects`);
  console.log(`💬 Messages: http://localhost:${PORT}/api/messages`);
});