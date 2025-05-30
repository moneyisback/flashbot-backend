import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function ProfitChart({ history }: { history: any[] }) {
  if (!Array.isArray(history)) {
    return <p style={{ color: 'red' }}>⛔ Données invalides</p>;
  }

  if (history.length === 0) {
    return <p style={{ color: 'lime' }}>📡 En attente des données MEV...</p>;
  }

  const data = {
    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Profit (ETH)',
        data: history.map(h => h.profit),
        borderColor: 'lime',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  return (
    <div style={{ background: '#111', padding: '1rem', borderRadius: '8px' }}>
      <h2 style={{ color: 'lime' }}>📈 Historique des profits</h2>
      <Line data={data} />
    </div>
  );
}
