import { useState, useEffect, useCallback } from 'react'
import { checkHealth, getDashboardStats } from '../services/api.js'

export function useDashboardData() {
  const [data, setData]           = useState(null)
  const [apiOnline, setApiOnline] = useState(false)

  const refresh = useCallback(async () => {
    try {
      await checkHealth()
      setApiOnline(true)
      const stats = await getDashboardStats()
      setData(stats)
    } catch {
      setApiOnline(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 4000)
    return () => clearInterval(id)
  }, [refresh])

  return { data, apiOnline, refresh }
}
