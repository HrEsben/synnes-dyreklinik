import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQSection } from "@/components/faq-section";
import { defaultFAQItems } from "@/lib/faq-data";
import { Mail, MapPin, Phone } from "lucide-react";
import Divider from "@/components/divider";

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Contact Section */}
      <section className="pt-30 pb-15 lg:pt-40 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="mb-6" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                lineHeight: '1.51em',
                color: '#2c2524'
              }}>
                Kontakt klinikken
              </h2>
              
              <p className="text-lg mb-8 leading-[1.9]" style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                color: '#817d7d'
              }}>
                Du er velkommen til at kontakte klinikken.<br />
                Jeg ser frem til at høre fra dig.
              </p>

              <div className="space-y-6">
                {/* Phone */}
                <Link href="tel:49400599" className="flex items-center space-x-4 hover:text-[#f97561] transition-all hover:translate-x-1 ease-in duration-300">
                  <div className="w-10 h-10 bg-[#f97561] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone color="#fff" size={20} />
                  </div>
                  <span className="text-lg font-semibold">
                    49400599
                  </span>
                </Link>

                {/* Email */}
                <Link href="mailto:info@synnesdyreklinik.dk" className="flex items-center space-x-4 hover:text-[#f97561] transition-all hover:translate-x-1 ease-in duration-300">
                  <div className="w-10 h-10 bg-[#f97561] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail color="#fff" size={20} />
                  </div>
                  <span className="text-lg font-semibold transition-colors">
                    info@synnesdyreklinik.dk
                  </span>
                </Link>

                {/* Location */}
                <Link href="https://www.google.com/maps?q=Gammel+Skolevej+5,+Ejby,+4070+Kirke+Hyllinge" className="flex items-center space-x-4 hover:text-[#f97561] transition-all hover:translate-x-1 ease-in duration-300">
                  <div className="w-10 h-10 bg-[#f97561] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin color="#fff" size={20} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold leading-relaxed">
                      Gammel Skolevej 5, Ejby<br />
                      4070 Kirke Hyllinge
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white p-8 rounded-[20px] border-[#e0dbdb] border-1">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2" style={{ 
                      fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#493d3c',
                      lineHeight: '1.111'
                    }}>
                      Navn
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Indtast dit navn"
                      className="w-full border border-[var(--neutral-500)] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] min-h-[65px] mb-0 px-[19px] text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] focus:ring-1 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold placeholder:font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2" style={{ 
                      fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#493d3c',
                      lineHeight: '1.111'
                    }}>
                      Email adresse
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Indtast din e-mail"
                      className="w-full border border-[var(--neutral-500)] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] min-h-[65px] mb-0 px-[19px] text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] focus:ring-1 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold placeholder:font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block mb-2" style={{ 
                      fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#493d3c',
                      lineHeight: '1.111'
                    }}>
                      Telefonnummer
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Indtast dit nummer"
                      className="w-full border border-[var(--neutral-500)] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] min-h-[65px] mb-0 px-[19px] text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] focus:ring-1 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold placeholder:font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="treatment" className="block mb-2" style={{ 
                      fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#493d3c',
                      lineHeight: '1.111'
                    }}>
                      Behandling
                    </label>
                    <select
                      id="treatment"
                      name="treatment"
                      className="w-full border border-[var(--neutral-500)] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] min-h-[65px] mb-0 px-[19px] text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] focus:ring-1 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold"
                    >
                      <option value="">Vælg behandling</option>
                      <option value="konsultation">Konsultation</option>
                      <option value="vaccination">Vaccination</option>
                      <option value="operation">Operation</option>
                      <option value="akut">Akut behandling</option>
                      <option value="andet">Andet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2" style={{ 
                    fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#493d3c',
                    lineHeight: '1.111'
                  }}>
                    Besked
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Skriv din besked her..."
                    className="w-full border border-[var(--neutral-500)] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] mb-0 px-[19px] py-4 text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] resize-vertical focus:ring-1 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold placeholder:font-semibold"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                >
                  Send henvendelse
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Divider />
      {/* FAQ Section */}
      <FAQSection items={defaultFAQItems} />

     
    </div>
  );
}
