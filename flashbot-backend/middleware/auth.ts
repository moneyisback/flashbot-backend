import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['authorization'];

  if (!key || key !== `Bearer ${process.env.API_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return; // ✅ plus de "return res" direct
  }

  next();
}
