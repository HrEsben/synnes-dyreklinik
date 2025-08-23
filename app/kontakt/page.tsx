"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQSectionClient } from "@/components/faq-section-client";
import { Mail, MapPin, Phone } from "lucide-react";
import Divider from "@/components/divider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
                Vi ser frem til at høre fra dig.
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
                      className="w-full border-1 border-[#e0dbdb] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] min-h-[65px] mb-0 px-[19px] text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] focus:ring-0.5 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold placeholder:font-semibold"
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
                      className="w-full border-1 border-[#e0dbdb] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] min-h-[65px] mb-0 px-[19px] text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] focus:ring-0.5 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold placeholder:font-semibold"
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
                      className="w-full border-1 border-[#e0dbdb] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] min-h-[65px] mb-0 px-[19px] text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] focus:ring-0.5 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold placeholder:font-semibold"
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
                    <Select name="treatment">
                      <SelectTrigger className="w-full border focus:border-0 bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] min-h-[65px] mb-0 px-[19px] text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] focus:ring-1 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold hover:border-[#f97561] data-[state=open]:ring-1 data-[state=open]:ring-[#f97561]">
                        <SelectValue placeholder="Vælg behandling" className="font-semibold" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-[14px] shadow-lg">
                        <SelectItem value="konsultation" className="text-base font-semibold hover:bg-[#fffaf6] focus:bg-[#fffaf6] cursor-pointer">Konsultation</SelectItem>
                        <SelectItem value="vaccination" className="text-base font-semibold hover:bg-[#fffaf6] focus:bg-[#fffaf6] cursor-pointer">Vaccination</SelectItem>
                        <SelectItem value="operation" className="text-base font-semibold hover:bg-[#fffaf6] focus:bg-[#fffaf6] cursor-pointer">Operation</SelectItem>
                        <SelectItem value="akut" className="text-base font-semibold hover:bg-[#fffaf6] focus:bg-[#fffaf6] cursor-pointer">Akut behandling</SelectItem>
                        <SelectItem value="andet" className="text-base font-semibold hover:bg-[#fffaf6] focus:bg-[#fffaf6] cursor-pointer">Andet</SelectItem>
                      </SelectContent>
                    </Select>
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
                    className="w-full border border-[#e0dbdb] bg-[var(--neutral-100)] text-[var(--primary-1)] rounded-[14px] mb-0 px-[19px] py-4 text-base leading-[1.375em] transition-[color_.3s,border-color_.3s] resize-vertical focus:ring-0.5 focus:ring-[#f97561] focus:border-[#f97561] outline-none font-semibold placeholder:font-semibold"
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
      <FAQSectionClient />

     
    </div>
  );
}
