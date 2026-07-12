import express from 'express';
import {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../controllers/driverController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getDrivers)
  .post(protect, authorize('fleet-manager', 'safety-officer'), createDriver);

router
  .route('/:id')
  .get(protect, getDriverById)
  .put(protect, authorize('fleet-manager', 'safety-officer'), updateDriver)
  .delete(protect, authorize('fleet-manager'), deleteDriver);

export default router;
