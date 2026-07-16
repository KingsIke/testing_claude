import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db.js';
import { validateTaskCreate, validateTaskUpdate } from '../utils/validators.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getAllTasks(req, res, next) {
  try {
    const db = getDatabase();
    const tasks = db.data.tasks || [];

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const task = db.data.tasks.find(t => t.id === id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description } = req.body;

    // Validate input
    const validation = validateTaskCreate(req.body);
    if (!validation.valid) {
      const error = new AppError('Validation failed', 400);
      error.validationErrors = validation.errors;
      throw error;
    }

    const db = getDatabase();
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description ? description.trim() : '',
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.data.tasks.push(newTask);
    await db.write();

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate updates
    const validation = validateTaskUpdate(updates);
    if (!validation.valid) {
      const error = new AppError('Validation failed', 400);
      error.validationErrors = validation.errors;
      throw error;
    }

    const db = getDatabase();
    const taskIndex = db.data.tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      throw new AppError('Task not found', 404);
    }

    const task = db.data.tasks[taskIndex];

    // Update only provided fields
    if (updates.title !== undefined) {
      task.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      task.description = updates.description.trim();
    }
    if (updates.status !== undefined) {
      task.status = updates.status;
    }

    task.updatedAt = new Date().toISOString();
    db.data.tasks[taskIndex] = task;
    await db.write();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const taskIndex = db.data.tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      throw new AppError('Task not found', 404);
    }

    const deletedTask = db.data.tasks.splice(taskIndex, 1)[0];
    await db.write();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask,
    });
  } catch (error) {
    next(error);
  }
}
