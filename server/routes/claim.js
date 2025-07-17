import express from 'express';
import { claimPoints, getClaimHistory, getAllClaimHistory } from '../controllers/claimController.js';

const router = express.Router();

// POST /api/claim - Claim points for a user
router.post('/', claimPoints);

// GET /api/claim/history/:userId - Get claim history for specific user
router.get('/history/:userId', getClaimHistory);

// GET /api/claim/history - Get all claim history (admin)
router.get('/history', getAllClaimHistory);

export default router;