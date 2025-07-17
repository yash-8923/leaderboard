import express from 'express';
import { getAllUsers, createUser, getUserById } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

// POST /api/users - Create new user
router.post('/', createUser);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

export default router;