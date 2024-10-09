const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Mongoose Task model
const { verifyToken } = require('../middleware/auth'); // Middleware to verify JWT token

// GET endpoint to retrieve a task by taskId
router.get('/task/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    // Check if taskId is valid
    if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    // Find the task by ID in the database
    const task = await Task.findById(taskId);

    // If task not found, send a 404 error
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Send back the task details as JSON
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
