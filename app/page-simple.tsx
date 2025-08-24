import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InteractiveHero from "@/components/interactive-hero";
import EditableImage from "@/components/editable-image";

export const metadata = {
  title: 'Synnes Dyreklinik - Velkommen',
  description: 'Erfaren dyrlæge med passion for familiens dyr og dyrenes familier. Med fokus på faglighed, fleksibilitet og tryghed hjælper jeg dig og dine dyr.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-10 lg:py-32 px-4 md:px-6 bg-[#fffaf6] overflow-hidden curved-bottom" style={{ minHeight: '600px' }}>
        <div className="mx-auto max-w-[1257px]" style={{ minHeight: '500px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center relative text-center lg:text-left" style={{ minHeight: '500px' }}>
            <div className="pt-35 order-1 lg:order-1">
              <h1 
                className="mb-4"
                style={{ 
                  fontWeight: 800, 
                  fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                  fontSize: '49px',
                  lineHeight: '1.51em',
                  color: '#2c2524',
                  minHeight: '150px'
                }}
              >
                Velkommen hos Synnes Dyreklinik
              </h1>
              <p
                className="text-lg mb-8 text-muted-foreground leading-[1.9]"
                style={{
                  fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '1.89em',
                  color: '#817d7d',
                  minHeight: '120px'
                }}
              >
                Jeg er en erfaren dyrlæge med passion for familiens dyr og dyrenes familier. Med fokus på faglighed, fleksibilitet og tryghed hjælper jeg dig og dine dyr.
              </p>
              <Link href="/booking">
                <Button className="bg-[#f97561] hover:bg-[#e85a47] text-white px-8 py-3 rounded-full text-lg font-semibold">
                  Book tid online
                </Button>
              </Link>
            </div>
            <InteractiveHero />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 md:px-6 bg-white">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-row md:flex-col lg:flex-row mb-0">
              <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0">
                <Image 
                  src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/phone-icon.svg" 
                  alt="Ring til klinikken" 
                  width={80} 
                  height={78}
                  priority
                />
              </div>
              <div>
                <h2 className="font-semibold text-xl mb-5.5 leading-tight tracking-tight">
                  Kontakt mig
                </h2>
                <Link href="mailto:info@synnesdyreklinik.dk">
                  <p className="text-lg font-semibold text-muted-foreground hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300 leading-0 underline">info@synnesdyreklinik.dk</p>
                </Link><br />
                <Link href="tel:+4549400599">
                  <p className="text-lg font-semibold text-muted-foreground hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300 leading-0 underline">+45 49 40 05 99</p>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col lg:flex-row mb-0">
              <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0">
                <Image 
                  src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/clock-icon.svg" 
                  alt="Åbningstider" 
                  width={80} 
                  height={78}
                  priority
                />
              </div>
              <div>
                <h2 className="font-semibold text-xl mb-5.5 leading-tight tracking-tight">
                  Åbningstider
                </h2>
                <div className="text-lg font-semibold text-muted-foreground leading-6">
                  <span className="text-secondary-foreground">Konsultation:</span><br />
                  <span>Hverdage kl. 8-16</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col lg:flex-row mb-0">
              <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0">
                <Image 
                  src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/map-pin-icon.svg" 
                  alt="Kontakt klinikken" 
                  width={80} 
                  height={78} 
                />
              </div>
              <div>
                <h2 className="font-semibold text-xl mb-5.5 leading-tight tracking-tight">
                  Lokation
                </h2>
                <p 
                  className="text-lg font-semibold text-muted-foreground leading-8"
                  dangerouslySetInnerHTML={{ __html: "Gammel Skolevej 5, Ejby<br />4070 Kirke Hyllinge" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="mb-6"
                style={{
                  fontWeight: 800,
                  fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                  fontSize: '42px',
                  lineHeight: '1.5em',
                  color: '#2c2524'
                }}
              >
                Om mig
              </h2>
              <p 
                className="text-lg mb-8 text-muted-foreground leading-[1.9]"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '1.89em',
                  color: '#817d7d'
                }}
              >
                Jeg hedder Synne og er uddannet dyrlæge fra Københavns Universitet i 2019. Siden da har jeg arbejdet i klinik og specialiseret mig i familiens kæledyr - hunde og katte. Jeg brænder for at skabe trygge rammer for både dig og dit dyr.
              </p>
            </div>
            <div className="order-first lg:order-last flex justify-center lg:justify-end">
              <EditableImage
                imageKey="about_image"
                fallbackSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/placeholder-vet.jpg"
                alt="Synne - Dyrlæge"
                width={400}
                height={500}
                className="rounded-lg object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
