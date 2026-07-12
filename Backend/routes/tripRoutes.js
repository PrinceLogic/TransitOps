import express from 'express';
import {
  getTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} from '../controllers/tripController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getTrips)
  .post(protect, authorize('fleet-manager', 'driver'), createTrip);

router.put('/:id/dispatch', protect, authorize('fleet-manager', 'driver'), dispatchTrip);
router.put('/:id/complete', protect, authorize('fleet-manager', 'driver'), completeTrip);
router.put('/:id/cancel', protect, authorize('fleet-manager', 'driver'), cancelTrip);

export default router;
