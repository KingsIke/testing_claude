import 'dotenv/config';
import express from 'express';
import { initializeDatabase } from './db.js';
import tasksRouter from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Tasks API is running',
    endpoints: {
      getTasks: 'GET /tasks',
      getTask: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
    },
  });
});

// Routes
app.use('/tasks', tasksRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\nAvailable endpoints:');
      console.log('  GET    /');
      console.log('  GET    /tasks');
      console.log('  GET    /tasks/:id');
      console.log('  POST   /tasks');
      console.log('  PUT    /tasks/:id');
      console.log('  DELETE /tasks/:id');
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

export default app;
