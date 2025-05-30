import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { FC } from 'react'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

// Typage clair pour l'historique
interface Opportunity {
  timestamp: string
  profit: number
}

interface ProfitChartProps {
  history: Opportunity[]
}

const ProfitChart: FC<ProfitChartProps> = ({ history }) => {
  if (!Array.isArray(history)) {
    console.error('❌ history is not an array:', history)
    return <div>Erreur de chargement des données</div>
  }

  const cleanHistory = history.filter(
    h =>
      h &&
      typeof h.timestamp === 'string' &&
      typeof h.profit === 'number' &&
      !isNaN(new Date(h.timestamp).getTime())
  )

  const data = {
    labels: cleanHistory.map(h => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Profit (ETH)',
        data: cleanHistory.map(h => h.profit),
        borderColor: 'lime',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  }

  return (
    <div style={{ background: '#111', padding: '1rem', borderRadius: '8px' }}>
      <h2 style={{ color: 'lime' }}>📈 Historique des profits</h2>
      <Line data={data} />
    </div>
  )
}

export default ProfitChart
