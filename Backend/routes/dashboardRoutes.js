import express from 'express';
import { getDashboardKPIs, getVehicleReports } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/kpis', protect, getDashboardKPIs);
router.get('/reports', protect, authorize('fleet-manager', 'financial-analyst'), getVehicleReports);

export default router;
