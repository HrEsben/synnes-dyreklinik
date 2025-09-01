'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SiteAlert {
  id: number
  message: string | null
  is_active: boolean
  alert_type: string
  created_at: string
  updated_at: string
}

interface AlertContextType {
  alert: SiteAlert | null
  isVisible: boolean
  dismissAlert: () => void
  refreshAlert: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<SiteAlert | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const supabase = createClient()

  const fetchAlert = async () => {
    try {
      const { data: allAlerts, error } = await supabase
        .from('site_alerts')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })

      if (!error && allAlerts && allAlerts.length > 0) {
        const latestAlert = allAlerts[0]
        setAlert(latestAlert)
        setIsVisible(true) // Reset visibility when new alert is fetched
      } else {
        setAlert(null)
      }
    } catch (error) {
      console.error('Error fetching alert:', error)
      setAlert(null)
    }
  }

  const dismissAlert = () => {
    setIsVisible(false)
  }

  const refreshAlert = () => {
    fetchAlert()
  }

  useEffect(() => {
    fetchAlert()

    // Set up real-time subscription
    const channel = supabase
      .channel('alert-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_alerts' }, 
        () => {
          fetchAlert()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const value = {
    alert: alert && isVisible ? alert : null,
    isVisible,
    dismissAlert,
    refreshAlert
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
