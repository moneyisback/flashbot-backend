import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import opportunitiesRouter from './api/opportunities'
import type { Request, Response } from 'express'

dotenv.config()

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/opportunities', opportunitiesRouter)

// Healthcheck
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Server start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on http://0.0.0.0:${PORT}`)
})
