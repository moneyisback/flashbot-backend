// utils/auth.ts
import type { Request, Response, NextFunction } from 'express'

export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const expectedToken = `Bearer ${process.env.API_SECRET}`

  if (!authHeader || authHeader !== expectedToken) {
    return res.status(403).json({ error: 'Forbidden - Invalid token' })
  }

  next()
}
