const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const SubTask = require('../models/subtask');

// Getting all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Getting task by ID
router.get('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId, {
      include: [{ model: SubTask, paranoid: false }],
    });

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Creating task
router.post('/', async (req, res) => {
  const { title, description, due_date } = req.body;

  try {
    const task = await Task.create({ title, description, due_date });
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Updating task by ID
router.put('/:id', async (req, res) => {
  const taskId = req.params.id;
  const { due_date, status } = req.body;

  try {
    const task = await Task.findByPk(taskId, {
      include: [{ model: SubTask, paranoid: false }],
    });

    if (task) {
      task.due_date = due_date || task.due_date;
      task.status = status || task.status;

      await task.save();
      res.json({ message: 'Task updated successfully', task });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete task by ID
router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);

    if (task) {
      task.deleted_at = new Date();
      await task.save();
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router
