require('dotenv').config();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import at the top



const app = express();
app.use(cors());
app.use(express.json());

// 1. Setup SQLite (This creates a file named 'database.sqlite' in your folder)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' 
});

// 2. Define the "User" Model
// User Model (keep as is)
// User Model (No changes needed here)
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// Task Model (Adding UserId)
const Task = sequelize.define('Task', {
  text: { type: DataTypes.STRING, allowNull: false },
  UserId: { type: DataTypes.INTEGER } // This connects the task to a user
});

// 🚀 The Magic Connection
User.hasMany(Task);
Task.belongsTo(User);
// Add this inside server.js to print all users every time the server starts
// Change this in your server.js
sequelize.sync().then(() => {
  console.log("✅ Database synced perfectly!");
  app.listen(5001, () => console.log("🚀 Server running on port 5001"));
}).catch(err => {
  console.error("❌ Database sync failed:", err);
});

// 4. Register Route
const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_super_secret_key_here"; // In a real app, use an environment variable

// --- REGISTRATION ROUTE ---
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = await User.create({ email, password });
    res.json({ message: "User registered successfully!", userId: newUser.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// --- LOGIN ROUTE ---
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });

    if (user) {
      res.json({ message: "Login success!", userId: user.id });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});
// GET all tasks
// Get tasks ONLY for a specific user
// GET tasks for a specific user
app.get("/tasks/:userId", async (req, res) => {
  const tasks = await Task.findAll({ where: { UserId: req.params.userId } });
  res.json(tasks);
});

// POST a task for a specific user
app.post("/tasks", async (req, res) => {
  const { text, userId } = req.body;
  const newTask = await Task.create({ text, UserId: userId });
  res.json(newTask);
});
// DELETE a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});