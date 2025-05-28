import { useEffect, useState } from 'react'
import ProfitChart from './components/ProfitChart'
import './App.css'

interface Opportunity {
  id?: string
  profit: number
  timestamp: string
}

function App() {
  const [data, setData] = useState<Opportunity[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL
      try {
        const res = await fetch(`${apiUrl}/api/opportunities/history`)
        const data = await res.json()
        setData(data)
      } catch (err) {
        console.error('🔥 Failed to fetch:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container">
      <h1>🚀 Flashbot Dashboard</h1>
      <ProfitChart history={data} />
    </div>
  )
}

export default App
