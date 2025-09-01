'use client'

import { useAlert } from './alert-context'

export default function AlertBanner() {
  const { alert, dismissAlert } = useAlert()

  // Don't render anything if no alert
  if (!alert || !alert.message) {
    return null
  }

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠️'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '🚨'
        }
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✅'
        }
      default: // info
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️'
        }
    }
  }

  const styles = getAlertStyles(alert.alert_type)

  return (
    <div className={`${styles.bg} ${styles.border} border-b px-4 py-3 fixed top-[86px] lg:top-[96px] left-0 right-0 z-[60] w-full`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-lg">{styles.icon}</span>
            <p className={`${styles.text} text-sm font-medium`}>
              {alert.message}
            </p>
          </div>
          <button
            onClick={dismissAlert}
            className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0 ml-4 p-1 cursor-pointer`}
            aria-label="Luk besked"
            type="button"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
