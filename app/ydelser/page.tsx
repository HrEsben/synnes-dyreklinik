import { createClient } from '@/lib/supabase/server'
import DynamicServices from '@/components/dynamic-services'
import Divider from '@/components/divider'

export const metadata = {
  title: "Ydelser - Synnes Dyreklinik",
  description: "Se vores omfattende udvalg af veterinære ydelser. Fra vaccinationer og operationer til konsultationer og specialbehandlinger - vi står klar til at hjælpe dit kæledyr.",
};

export default async function YdelserPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Fetch services from database
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero-section" className="relative pb-12 pt-20 px-4 md:px-6 bg-[#fffaf6] overflow-hidden">
        <div className="mx-auto max-w-[1257px]">
          <div className="text-center">
            <h1 className="mb-6" style={{ 
              fontWeight: 800, 
              fontFamily: '"Poppins ExtraBold", Poppins, sans-serif', 
              fontSize: 'clamp(32px, 5vw, 49px)', 
              lineHeight: '1.51em', 
              color: 'rgb(44, 37, 36)' 
            }}>
              Ydelser
            </h1>
            <p className="mb-8 text-xl lg:text-lg font-medium text-muted-foreground max-w-3xl mx-auto leading-[1.9]">
              Vi tilbyder de fleste veterinære ydelser, og prioriterer at investere i moderne udstyr og efteruddannelse til personalet. Her kan du læse mere om de mest almindelige konsultationer og behandlinger.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Services from Database */}
      <DynamicServices 
        isAuthenticated={isAuthenticated} 
        initialServices={services || []}
      />

      <Divider />

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px] text-center">
          <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-accent-foreground">
            Har du spørgsmål?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vi står altid klar med råd og vejledning omkring dit kæledyr. Kontakt os hellere en gang for meget end en gang for lidt, hvis der er noget du er utryg ved eller er i tvivl om.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:49400599" 
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#f97561] rounded-full hover:bg-[#e66651] transition-colors"
            >
              Ring til os: 49 40 05 99
            </a>
            <a 
              href="mailto:info@synnesdyreklinik.dk" 
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#f97561] bg-white border-2 border-[#f97561] rounded-full hover:bg-[#f97561] hover:text-white transition-colors"
            >
              Send os en mail
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
