import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';

const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only'),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  username: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(1),
}).refine(d => d.username || d.email, { message: 'username or email is required' });

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: isProd,                 // true in production (requires HTTPS)
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}


export async function register(req, res, next) {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    // Basic duplicate check for better error messages
    const existing = await User.findOne({ $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] }).lean();
    if (existing) {
      const field = existing.username === username.toLowerCase() ? 'Username' : 'Email';
      return res.status(409).json({ error: `${field} already in use` });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    setAuthCookie(res, token);
    res.status(201).json({ user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Check if 'errors' is present and handle the error properly
      const errorMessages = err.errors ? err.errors.map(e => e.message).join(', ') : 'Invalid input';
      return res.status(400).json({ error: errorMessages });
    }
    // Handle duplicate key race condition
    if (err?.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0] || 'Field';
      return res.status(409).json({ error: `${key} already in use` });
    }
    next(err);
  }
}


export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const identifier = data.username ?? data.email;
    const query = data.username
      ? { username: data.username.toLowerCase() }
      : { email: data.email.toLowerCase() };

    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    setAuthCookie(res, token);  // Cookie already set
    res.json({ user, token });  // Send token in the response
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    next(err);
  }
}


export async function me(req, res) {
  res.json({ user: req.user });
}

export async function logout(req, res) {
  res.clearCookie('access_token', { path: '/' });
  res.json({ ok: true });
}