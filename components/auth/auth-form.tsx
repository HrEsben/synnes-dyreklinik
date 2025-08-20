'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'

export default function AuthForm() {
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-blue-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: 'E-mail',
              password_label: 'Adgangskode',
              button_label: 'Log ind',
              loading_button_label: 'Logger ind...',
              social_provider_text: 'Log ind med {{provider}}',
              link_text: 'Har du allerede en konto? Log ind',
            },
            sign_up: {
              email_label: 'E-mail',
              password_label: 'Adgangskode',
              button_label: 'Opret konto',
              loading_button_label: 'Opretter konto...',
              social_provider_text: 'Opret konto med {{provider}}',
              link_text: 'Har du ikke en konto? Opret en',
            },
            forgotten_password: {
              email_label: 'E-mail',
              button_label: 'Send instruktioner',
              loading_button_label: 'Sender instruktioner...',
              link_text: 'Glemt adgangskode?',
              confirmation_text: 'Tjek din e-mail for link til at nulstille adgangskoden',
            },
          },
        }}
        providers={['google']}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
}
