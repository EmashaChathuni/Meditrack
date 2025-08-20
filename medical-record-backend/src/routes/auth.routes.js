import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, register, me, logout } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', auth, me);
router.post('/logout', logout);

export default router;