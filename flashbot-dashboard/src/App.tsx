import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfitChart from './components/ProfitChart';

// Define the Opportunity type according to your API response structure
interface Opportunity {
  // Example fields, replace with actual fields from your API
  id: string;
  profit: number;
  timestamp: string;
}

function App() {
  const [data, setData] = useState<Opportunity[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
    axios.get<Opportunity>(`${import.meta.env.VITE_API_URL}/api/opportunities`)
      .then((res: import('axios').AxiosResponse<Opportunity>) => {
      setData((prev: Opportunity[]) => [...prev.slice(-49), res.data]); // Limite 50 points
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#0f0' }}>🚀 Flashbot Dashboard</h1>
      <ProfitChart history={data} />
    </div>
  );
}

export default App;
