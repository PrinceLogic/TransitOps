import express from 'express';
import {
  getMaintenanceLogs,
  createMaintenanceLog,
  closeMaintenanceLog,
} from '../controllers/maintenanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getMaintenanceLogs)
  .post(protect, authorize('fleet-manager'), createMaintenanceLog);

router.put('/:id/close', protect, authorize('fleet-manager'), closeMaintenanceLog);

export default router;
