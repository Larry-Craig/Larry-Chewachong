const express = require('express');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Configure Nodemailer Transporter using Gmail with IPv4 fix
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Force IPv4 to bypass Render's IPv6 routing block
  family: 4,
  // Optional: Add timeout settings for better reliability
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

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

// POST /api/contact - Save message to PostgreSQL and Send Email
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
    
    console.log('📬 New message saved to database:', rows[0]);

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `
        <h3>New Portfolio Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✉️ Email notification sent successfully!');
    } catch (mailError) {
      console.error('⚠️ Detailed Mail Error Failure:', mailError);
      // Don't fail the request if email fails - just log it
      // The message was already saved to database
    }
    
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