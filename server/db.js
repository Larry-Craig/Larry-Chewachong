const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase cloud connection
});

const initDb = async () => {
  try {
    // 1. Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        tags TEXT[] NOT NULL,
        live_url TEXT,
        live_demo_url TEXT,
        github_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        domain VARCHAR(100) NOT NULL,
        color VARCHAR(100) DEFAULT 'from-blue-400 to-indigo-500'
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure live_demo_url column exists if table was created previously
    await pool.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_demo_url TEXT;
    `);

    // 2. Seed Skills if empty
    const skillsCount = await pool.query('SELECT COUNT(*) FROM skills');
    if (parseInt(skillsCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO skills (name, domain, color) VALUES
        ('React / Next.js', 'Frontend', 'from-cyan-400 to-blue-500'),
        ('Node.js / Express', 'Backend', 'from-green-400 to-emerald-500'),
        ('FastAPI', 'Backend', 'from-teal-400 to-cyan-500'),
        ('PostgreSQL', 'Database', 'from-blue-400 to-indigo-500'),
        ('Docker', 'DevOps', 'from-sky-400 to-blue-500'),
        ('Tailwind CSS', 'Frontend', 'from-cyan-400 to-teal-500'),
        ('TypeScript', 'Languages', 'from-blue-500 to-purple-500'),
        ('Git / GitHub', 'DevOps', 'from-orange-400 to-red-500');
      `);
      console.log('🌱 Seeded initial skills into Supabase!');
    }

    // 3. Projects Configuration
    const projects = [
      {
        title: "Emplora",
        description: "A full-stack recruitment platform designed to streamline hiring. Features role-based access control (RBAC), secure JWT authentication, applicant screening workflows, and real-time candidate messaging.",
        tags: ["React", "Node.js", "Express", "MongoDB", "Socket.IO"],
        github_url: "https://github.com/Larry-Craig",
        live_url: "https://github.com/user-attachments/assets/9454f4a8-f2d3-4155-b642-0a4337a42017",
        live_demo_url: "https://github.com/user-attachments/assets/9454f4a8-f2d3-4155-b642-0a4337a42017"
      },
      {
        title: "CAFAD Web Platform",
        description: "An organizational platform and service diagnosis hub engineered for seamless content delivery, community outreach, and automated member management. Built with a responsive, glassmorphic UI.",
        tags: ["TypeScript", "Next.js", "Tailwind CSS", "PostgreSQL"],
        github_url: "https://github.com/Larry-Craig",
        live_url: "https://github.com/user-attachments/assets/78947ed5-39fb-49b7-b70b-6c59fdb9995b",
        live_demo_url: "https://github.com/user-attachments/assets/78947ed5-39fb-49b7-b70b-6c59fdb9995b"
      },
      {
        title: "Delivery Buddy Microservice API",
        description: "A production RESTful API backend providing core business logic, real-time status tracking, and database synchronization. Fully documented with OpenAPI/Swagger specifications.",
        tags: ["Node.js", "Express", "Swagger / OpenAPI", "PostgreSQL", "Render"],
        github_url: "https://github.com/Larry-Craig",
        live_url: "https://delivery-buddy-backend.onrender.com/docs",
        live_demo_url: "https://delivery-buddy-backend.onrender.com/docs"
      }
    ];

    const projectsCount = await pool.query('SELECT COUNT(*) FROM projects');
    
    if (parseInt(projectsCount.rows[0].count) === 0) {
      // Seed if table is empty
      for (const project of projects) {
        await pool.query(`
          INSERT INTO projects (title, description, tags, github_url, live_url, live_demo_url)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          project.title,
          project.description,
          project.tags,
          project.github_url,
          project.live_url,
          project.live_demo_url
        ]);
      }
      console.log('🌱 Seeded initial projects into Supabase!');
    } else {
      // Update existing records with modern asset URLs
      for (const project of projects) {
        await pool.query(`
          UPDATE projects 
          SET live_url = $1, live_demo_url = $2, description = $3, tags = $4, github_url = $5
          WHERE title = $6
        `, [
          project.live_url,
          project.live_demo_url,
          project.description,
          project.tags,
          project.github_url,
          project.title
        ]);
      }
      console.log('🔄 Updated existing projects in Supabase with CDN demo URLs!');
    }

    console.log('⚡ Supabase PostgreSQL tables verified and active!');
  } catch (err) {
    console.error('❌ Supabase DB Connection Error:', err.message);
  }
};

module.exports = { pool, initDb };