import express from 'express';
import { getExpenses, createExpense } from '../controllers/expenseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getExpenses)
  .post(protect, authorize('fleet-manager', 'financial-analyst'), createExpense);

export default router;
