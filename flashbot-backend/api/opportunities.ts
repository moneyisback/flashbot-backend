import { Router } from 'express'
import type { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()
const LOG_PATH = path.join(__dirname, '..', 'logs', 'opportunity-log.json')

interface Opportunity {
  [key: string]: any
}

let opportunities: Opportunity[] = []

// Load from JSON if exists
if (fs.existsSync(LOG_PATH)) {
  try {
    const raw = fs.readFileSync(LOG_PATH, 'utf8')
    opportunities = JSON.parse(raw)
    console.log(`🧠 Opportunités chargées (${opportunities.length})`)
  } catch (err) {
    console.error('❌ Lecture JSON échouée :', err)
  }
}

// POST /api/opportunities
router.post('/', (req: Request, res: Response): void => {
  const opp = req.body

  if (!opp) {
    res.status(400).send('no opp')
    return
  }

  opportunities.push(opp)

  try {
    fs.writeFileSync(LOG_PATH, JSON.stringify(opportunities.slice(-1000), null, 2))
  } catch (err) {
    console.error('❌ Sauvegarde échouée :', err)
  }

  res.send({ success: true })
})

// GET /api/opportunities/latest
router.get('/latest', (_req: Request, res: Response): void => {
  if (opportunities.length === 0) {
    res.status(404).send('No opportunities yet')
    return
  }

  res.send(opportunities[opportunities.length - 1])
})

// GET /api/opportunities/history
router.get('/history', (_req: Request, res: Response): void => {
  console.log('🧪 [BACKEND] Reçu GET /history') // 👈 log de debug ici
  res.send(opportunities?.slice(-50).reverse() || [])
})

export default router
