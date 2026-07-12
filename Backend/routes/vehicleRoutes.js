import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getVehicles)
  .post(protect, authorize('fleet-manager'), createVehicle);

router
  .route('/:id')
  .get(protect, getVehicleById)
  .put(protect, authorize('fleet-manager'), updateVehicle)
  .delete(protect, authorize('fleet-manager'), deleteVehicle);

export default router;
