const express = require('express');
const router = express.Router();
const SubTask = require('../models/subtask');

//all subtasks
router.get('/', async (req, res) => {
  try {
    const subtasks = await SubTask.findAll();
    res.json(subtasks);
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get subtask by ID
router.get('/:id', async (req, res) => {
  const subtaskId = req.params.id;

  try {
    const subtask = await SubTask.findByPk(subtaskId);

    if (subtask) {
      res.json(subtask);
    } else {
      res.status(404).json({ message: 'Subtask not found' });
    }
  } catch (error) {
    console.error('Error fetching subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Creating subtask
router.post('/', async (req, res) => {
  const { task_id } = req.body;

  try {
    const subtask = await SubTask.create({ task_id });
    res.status(201).json({ message: 'Subtask created successfully', subtask });
  } catch (error) {
    console.error('Error creating subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Updating subtask by ID
router.put('/:id', async (req, res) => {
  const subtaskId = req.params.id;
  const { status } = req.body;

  try {
    const subtask = await SubTask.findByPk(subtaskId);

    if (subtask) {
      subtask.status = status || subtask.status;

      await subtask.save();
      res.json({ message: 'Subtask updated successfully', subtask });
    } else {
      res.status(404).json({ message: 'Subtask not found' });
    }
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete subtask by ID (soft deletion)
router.delete('/:id', async (req, res) => {
  const subtaskId = req.params.id;

  try {
    const subtask = await SubTask.findByPk(subtaskId);

    if (subtask) {
      subtask.deleted_at = new Date();
      await subtask.save();
      res.json({ message: 'Subtask deleted successfully' });
    } else {
      res.status(404).json({ message: 'Subtask not found' });
    }
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
