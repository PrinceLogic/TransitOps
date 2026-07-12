import express from 'express';
import { registerUser, loginUser, getUserProfile, seedDemoUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/seed', seedDemoUsers);

export default router;
