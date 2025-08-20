import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function auth(req, res, next) {
  try {
    let token;

    if (req.cookies?.access_token) {
      token = req.cookies.access_token;
      console.log('Token from cookie:', token);
      
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token from Authorization header:', token);
    }

  

    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
     console.log('Decoded payload:', payload);
      
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ error: 'User not found' });

    delete user.passwordHash;
    req.user = user;
    next();
  } catch {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
