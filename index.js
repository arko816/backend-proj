const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');
const authMiddleware = require('./middleware/authMiddleware');
const taskRouter = require('./controllers/taskController');
const subtaskRouter = require('./controllers/subtaskController');
const userRouter = require('./controllers/userController');
const authRouter = require('./controllers/authController');

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Middleware
app.use(bodyParser.json());
app.use(authMiddleware);

// Routes
app.use('/api/tasks', taskRouter);
app.use('/api/subtasks', subtaskRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
