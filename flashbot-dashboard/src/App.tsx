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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL
      try {
        const res = await fetch(`${apiUrl}/api/opportunities/history`)
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        setData(data)
      } catch (err) {
        console.error('🔥 Failed to fetch:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container">
      <h1>🚀 Flashbot Dashboard</h1>
      <ProfitChart history={loading ? [] : data} />
    </div>
  )
}

export default App
