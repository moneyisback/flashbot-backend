import express, { Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/', requireAuth, (req: Request, res: Response) => {
  const { token, profit } = req.body;
  console.log(`🔫 Launch requested for ${token} with ${profit} ETH profit`);
  res.json({ status: 'ok', message: 'Flashloan launch trigger received' });
});

export default router;
