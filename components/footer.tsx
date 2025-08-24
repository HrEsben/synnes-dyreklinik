import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t-1 text-muted-foreground py-15 w-full">
      <div className="max-w-[1257px] mx-auto lg:px-0 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-3 lg:col-span-1">
            <div className="w-[120px] h-[50px] mb-4">
              <Image 
                src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/logo.svg" 
                alt="Synnes dyreklinik" 
                width={120} 
                height={50} 
                className="mb-4"
              />
            </div>
            <p className="leading-6 text-base font-semibold max-w-[310px] mb-8">
              Vi glæder os til at møde dig og dit dyr. Besøg også Synnes Dyreklinik på de sociale medier.
            </p>
            
            <div>
              <div className="flex space-x-4 text-secondary-foreground">
                <a 
                  href="https://www.facebook.com/profile.php?id=100092467219032" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-secondary rounded-full p-2 hover:text-white hover:bg-[#f97561] transition-colors"
                >
                  <Facebook size={16} />
                </a>
                <a 
                  href="https://www.instagram.com/synnesdyreklinik/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-secondary rounded-full p-2 hover:text-white hover:bg-[#f97561] transition-colors"
                >
                  <Instagram size={16} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/synne-fyhn-stephansen-ab466054" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-secondary rounded-full p-2 hover:text-white hover:bg-[#f97561] transition-colors"
                >
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
                <Link href="/om">Om klinikken</Link>
              </li>
              <li className="hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300">
                <Link href="/gdpr">GDPR</Link>
              </li>
              <li className="hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300">
                <Link href="/kontakt">Kontakt</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-3 md:col-span-1 lg:col-span-1 min-w-[300px]">
            <div className="bg-[#fbfbfb] rounded-3xl p-11 lg:py-14 lg:px-10 space-y-4.5">
              <h4 className="text-[22px] text-accent-foreground font-extrabold leading-6">Kontakt mig</h4>
              <div className="flex items-start space-x-3">
                <MapPin color="#f97561" size={24} className="flex-shrink-0 mt-1" />
                <div className="font-semibold text-lg">
                  Gammel Skolevej 5, Ejby<br />
                  4070 Kirke Hyllinge
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail color="#f97561" size={24} className="flex-shrink-0 mt-0.5" />
                <div className="font-semibold text-lg">
                  <Link 
                    href="mailto:info@synnesdyreklinik.dk"
                    className="hover:text-[#f97561] transition-colors"
                  >
                    info@synnesdyreklinik.dk
                  </Link>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone color="#f97561" size={24} className="flex-shrink-0 mt-0.5" />
                <div className="font-semibold text-lg">
                  <Link 
                    href="tel:49400599"
                    className="hover:text-[#f97561] transition-colors"
                  >
                    49 40 05 99
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
