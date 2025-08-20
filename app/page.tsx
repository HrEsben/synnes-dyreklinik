import Link from "next/link";
import Image from "next/image";
import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button";
import InteractiveHero from "@/components/interactive-hero";
import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";
import { Linkedin } from "lucide-react";

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-10 lg:py-32 px-4 md:px-6 bg-[#fffaf6] overflow-hidden curved-bottom">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center relative text-center lg:text-left">
            <div className="pt-35 order-1 lg:order-1">
              <h1 className="mb-4" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: '49px',
                lineHeight: '1.51em',
                color: '#2c2524'
              }}>
                Velkommen hos<br />
               Synnes Dyreklinik
              </h1>
              <p className="text-lg mb-8 text-muted-foreground leading-[1.9]" style={{
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '1.89em',
                color: '#817d7d'
              }}>
                Jeg er en erfaren dyrlæge med passion for familiens dyr og dyrenes familier. 
                Med fokus på faglighed, fleksibilitet og tryghed hjælper jeg dig og dine dyr.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/kontakt">
                  <Button size={"lg"}>
                    Kontakt os
                  </Button>
                </Link>
                {user ? (
                  <Link
                    href="/dashboard"
                  >
                    <Button size={"lg"} variant={"outline"}>
                      Mit Dashboard
                    </Button>
                  </Link>
                ) : (
              ""  )}
              </div>
            </div>
            <div className="order-2 lg:order-2">
              <InteractiveHero />
            </div>
          </div>
        </div>
      </section>
 {/* Contact info */}
 <section className="lg:pt-35.5 pt-24 border-b-1 border-[#e0dbdb] pb-25 lg:pb-24">
  <div className="flex flex-col md:flex-row justify-between mx-6">
    <div className="flex flex-row md:flex-col lg:flex-row mb-12 md:mb-0">
      <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0">
        <Image src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/letter-icon.svg" alt="Kontakt klinikken" width={80} height={78} /></div>
      <div>
      <h2 className="font-semibold text-xl mb-5.5 leading-tight tracking-tight">Kontakt mig</h2>
      <Link href="mailto:info@synnesdyreklinik.dk">
      <p className="text-lg font-semibold text-muted-foreground hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300 leading-0 underline">info@synnesdyreklinik.dk</p>
      </Link><br />
      <Link href="tel:+4549400599">
        <p className="text-lg font-semibold text-muted-foreground hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300 leading-0 underline">+45 49 40 05 99</p>
      </Link>
      </div>
    </div>
    <div className="flex flex-row md:flex-col lg:flex-row mb-12 md:mb-0">
      <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0">
        <Image src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/clock-icon.svg" alt="Åbningstider" width={80} height={78} /></div>
      <div>
      <h2 className="font-semibold text-xl mb-5.5 leading-tight tracking-tight">Åbningstider</h2>
      <p className="text-lg font-semibold text-muted-foreground leading-6"><span className="text-secondary-foreground">Konsultation:</span><br />
     Hverdage kl. 8-16</p>
      </div>
    </div>
    <div className="flex flex-row md:flex-col lg:flex-row mb-0">
      <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0">
        <Image src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/map-pin-icon.svg" alt="Kontakt klinikken" width={80} height={78} /></div>
      <div>
      <h2 className="font-semibold text-xl mb-5.5 leading-tight tracking-tight">Lokation</h2>
      <p className="text-lg font-semibold text-muted-foreground leading-6">Gammel Skolevej 5, Ejby<br />
      4070 Kirke Hyllinge</p>
      </div>
    </div>
  </div>
 </section>
      {/* About Section */}
      <section className="py-25 px-6 bg-[#fffaf6]">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="order-2 lg:order-1">
            <Image src={"https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/synneanddog.jpg"} width={488} height={574} alt="Synne og hund" className="rounded-4xl -rotate-4"/>
          </div>
          <div className="order-1 lg:order-2 mb-16 ml-8 w-full md:w-[611px] lg:max-w-[45%]">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-accent-foreground mb-2.5 lg:mb-6">
              Kort om mig...
            </h2>
            <div className="mb-5 lg:mb-6">
              <p className="text-muted-foreground text-lg font-semibold leading-8">
                Mit navn er Synne Fyhn Stephansen. Jeg blev uddannet dyrlæge i 2009. Min erfaring spænder bredt. 
                Jeg varetager både medicinske udredninger, kirurgiske indgreb samt tandbehandlinger. 
                Jeg tilser de fleste typer patienter.
              </p>
            </div>
          
          
          <div className="mb-8 md:mb-10 lg:mb-13">
            <ul className="space-y-5">
              <li className="flex items-start">
                <div className="w-7.5 h-7.5 bg-[#ffca0e] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">
                  Over 10 års erfaring
                </h3>
              </li>
              
              <li className="flex items-end">
                <div className="w-7.5 h-7.5 bg-[#ffca0e] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">
                  Erfaring fra henvisningshospitaler i København
                </h3>
              </li>
              
              <li className="flex items-end">
                <div className="w-7.5 h-7.5 bg-[#ffca0e] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">
                  Dyrlæge for politiets tjenestehunde
                </h3>
              </li>
            </ul>
          </div>
          
          <div>
            <Link
              href="/om"
            >
              <Button size={"lg"}>
                Mere om mig
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-15 px-4 bg-[#611471] text-white">
         <div className="flex flex-col lg:flex-row items-center justify-center">
           <div className="mx-auto text-center">
             <h2 className="text-3xl md:text-3xl lg:text-4xl font-extrabold mb-6">
               Book en aftale<br />allerede i dag
             </h2>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/kontakt"
            >
              <Button className="py-5.5 px-5 text-lg font-bold w-full">
                Kontakt mig
              </Button>
            </Link>
          </div>
          </div>
          <div className="flex-shrink-0 mt-[-30px] lg:mt-[-157px]">
             <Image
               src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/sideeye_synne.webp"
               alt="Synne dyrlæge"
               width={550}
               height={600}
               className=""
             />
           
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-muted-foreground py-15 px-6">
        <div className="px-0 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-3 md:col-span-1">
              <Image src={"https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/logo.svg"} alt="Synnes dyreklinik" width={120} height={50} className="mb-4"/>
                <p className="leading-6 text-base font-semibold max-w-[310px] mb-8">Jeg glæder mig til at møde dig og dit dyr. Besøg også Synnes Dyreklinik på de sociale medier.
      </p>
            
            
            <div>
              <div className="flex space-x-4 text-secondary-foreground">
                <a href="https://www.facebook.com/profile.php?id=100092467219032" target="_blank" rel="noopener noreferrer" className="bg-secondary rounded-full p-2 hover:text-white hover:bg-[#f97561] transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="https://www.instagram.com/synnesdyreklinik/" target="_blank" rel="noopener noreferrer" className="bg-secondary rounded-full p-2 hover:text-white hover:bg-[#f97561] transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="https://www.linkedin.com/in/synne-fyhn-stephansen-ab466054" target="_blank" rel="noopener noreferrer" className="bg-secondary rounded-full p-2 hover:text-white hover:bg-[#f97561] transition-colors">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
            </div>
              <div className="col-span-3 md:col-span-1 text-base font-semibold">
               <ul className="space-y-6 leading-5">
                 <li className="hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300">
                  <Link href="/">Forside</Link>
                 </li>
                   <li className="hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300">
                  <Link href="/" >
                  Om klinikken</Link>
                 </li>
                   <li className="hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300">
                  <Link href="/">GDPR</Link>
                 </li>
                   <li className="hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300">
                  <Link href="/">Kontakt</Link>
                 </li>
               </ul>
                </div>
          <div className="col-span-3 md:col-span-1">
            <div className="bg-[#fbfbfb] rounded-3xl p-11 lg:py-14 lg:px-10">
             <h4 className="text-[22px] text-accent-foreground font-extrabold leading-6">Kontakt mig</h4>
            </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
