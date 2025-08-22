import AuthForm from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 md:px-6 bg-[#fffaf6] overflow-hidden">
        <div className="mx-auto max-w-[1257px]">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              
              <h1 className="mb-4" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                lineHeight: '1.51em',
                color: '#2c2524'
              }}>
                Log ind
              </h1>
              <p className="text-lg text-muted-foreground leading-[1.9] max-w-md mx-auto" style={{
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '1.89em',
                color: '#817d7d'
              }}>
                Log ind for at få redigere hjemmesiden
              </p>
            </div>
            
            <div className="w-full max-w-md">
              <AuthForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
