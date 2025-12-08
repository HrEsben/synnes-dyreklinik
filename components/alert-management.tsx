'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface SiteAlert {
  id: number
  message: string | null
  is_active: boolean
  alert_type: string
  created_at: string
  updated_at: string
}

interface AlertManagementProps {
  initialAlert: SiteAlert | null
}

export default function AlertManagement({ initialAlert }: AlertManagementProps) {
  const [alertData, setAlertData] = useState<SiteAlert | null>(initialAlert)
  const [message, setMessage] = useState(initialAlert?.message || '')
  const [isActive, setIsActive] = useState(initialAlert?.is_active || false)
  const [alertType, setAlertType] = useState(initialAlert?.alert_type || 'info')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    try {
      const alertDataPayload = {
        message: message.trim() || null,
        is_active: isActive,
        alert_type: alertType,
        updated_at: new Date().toISOString()
      }

      if (alertData) {
        // Update existing alert
        const { data, error } = await supabase
          .from('site_alerts')
          .update(alertDataPayload)
          .eq('id', alertData.id)
          .select()
          .single()

        if (error) throw error
        setAlertData(data)
      } else {
        // Create new alert
        const { data, error } = await supabase
          .from('site_alerts')
          .insert({
            ...alertDataPayload,
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) throw error
        setAlertData(data)
      }

    } catch (error) {
      console.error('Error saving alert:', error)
      window.alert('Fejl ved gemning af alert')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-xl font-bold mb-6" style={{ 
        fontFamily: 'Poppins, sans-serif',
        color: '#2c2524'
      }}>
        Advarselsbesked
      </h2>
      
      <div className="space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Sluk/Aktiver</h3>
            <p className="text-sm text-gray-500">
              Vis advarsel på hjemmeside?
            </p>
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2c2524] focus:ring-offset-2 ${
              isActive ? 'bg-[#2c2524]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Alert Type */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#2c2524' }}>
            Type
          </label>
          <select
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
          >
            <option value="info">Info (Blå)</option>
            <option value="warning">Advarsel (Gul)</option>
            <option value="error">Fejl (Rød)</option>
            <option value="success">Succes (Grøn)</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#2c2524' }}>
            Besked
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
            placeholder="Skriv din besked her... (f.eks. 'Telefonerne virker ikke. Ring på 20 12 34 56 i stedet.')"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lad feltet være tomt for at skjule advarslen
          </p>
        </div>

        {/* Preview */}
        {isActive && message.trim() && (
          <div>
            <h4 className="text-sm font-medium mb-2" style={{ color: '#2c2524' }}>
              Preview:
            </h4>
            <div className={`p-4 rounded-lg border-l-4 ${
              alertType === 'info' ? 'bg-blue-50 border-blue-400 text-blue-800' :
              alertType === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
              alertType === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
              'bg-green-50 border-green-400 text-green-800'
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Gemmer...' : 'Gem Advarsel'}
        </Button>
      </div>
    </div>
  )
}
