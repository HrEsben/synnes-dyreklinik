'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Redirect to dashboard on successful sign in
          router.push('/dashboard')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  if (!mounted) {
    return (
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-12 bg-blue-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <Auth
        supabaseClient={supabase}
        view="sign_in"
        showLinks={false}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2c2524',
                brandAccent: '#1a1714',
                defaultButtonBackground: '#2c2524',
                defaultButtonBackgroundHover: '#1a1714',
              },
              fonts: {
                bodyFontFamily: 'Poppins, sans-serif',
                buttonFontFamily: 'Poppins, sans-serif',
                inputFontFamily: 'Poppins, sans-serif',
                labelFontFamily: 'Poppins, sans-serif',
              },
              fontSizes: {
                baseBodySize: '16px',
                baseInputSize: '16px',
                baseLabelSize: '14px',
                baseButtonSize: '16px',
              },
              borderWidths: {
                buttonBorderWidth: '1px',
                inputBorderWidth: '1px',
              },
              radii: {
                borderRadiusButton: '8px',
                buttonBorderRadius: '8px',
                inputBorderRadius: '8px',
              },
              space: {
                buttonPadding: '12px 24px',
                inputPadding: '12px 16px',
              },
            },
          },
          className: {
            container: 'space-y-6',
            button: 'w-full font-medium transition-all duration-200 hover:shadow-md',
            input: 'w-full transition-all duration-200 focus:ring-2 focus:ring-opacity-50',
            label: 'font-medium text-gray-700',
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
        providers={[]}
        onlyThirdPartyProviders={false}
      />
    </div>
  )
}
