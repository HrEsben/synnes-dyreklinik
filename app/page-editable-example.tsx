import Link from "next/link";
import Image from "next/image";
import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button";
import InteractiveHero from "@/components/interactive-hero";
import EditableText from "@/components/editable-text";

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
              <EditableText
                contentKey="homepage_hero_title"
                defaultValue="Velkommen hos Synnes Dyreklinik"
                tag="h1"
                className="mb-4"
                style={{ 
                  fontWeight: 800, 
                  fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                  fontSize: '49px',
                  lineHeight: '1.51em',
                  color: '#2c2524'
                }}
              />
              
              <EditableText
                contentKey="homepage_hero_description"
                defaultValue="Jeg er en erfaren dyrlæge med passion for familiens dyr og dyrenes familier. Med fokus på faglighed, fleksibilitet og tryghed hjælper jeg dig og dine dyr."
                tag="p"
                multiline={true}
                className="text-lg mb-8 text-muted-foreground leading-[1.9]"
                style={{
                  fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '1.89em',
                  color: '#817d7d'
                }}
              />

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/kontakt">
                  <Button size={"lg"}>
                    Kontakt os
                  </Button>
                </Link>
                {user ? (
                  <Link href="/dashboard">
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

      {/* About Section */}
      <section className="py-25 px-6 bg-[#fffaf6]">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="order-2 lg:order-1">
            <Image src={"https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/synneanddog.jpg"} width={488} height={574} alt="Synne og hund" className="rounded-4xl -rotate-4"/>
          </div>
          <div className="order-1 lg:order-2 mb-16 ml-8 w-full md:w-[611px] lg:max-w-[45%]">
            <EditableText
              contentKey="homepage_about_title"
              defaultValue="Kort om mig..."
              tag="h2"
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-accent-foreground mb-2.5 lg:mb-6"
            />
            
            <div className="mb-5 lg:mb-6">
              <EditableText
                contentKey="homepage_about_description"
                defaultValue="Mit navn er Synne Fyhn Stephansen. Jeg blev uddannet dyrlæge i 2009. Min erfaring spænder bredt. Jeg varetager både medicinske udredninger, kirurgiske indgreb samt tandbehandlinger. Jeg tilser de fleste typer patienter."
                tag="p"
                multiline={true}
                className="text-muted-foreground text-lg font-semibold leading-8"
              />
            </div>
          
            {/* Experience list - could also be made editable */}
            <div className="mb-8 md:mb-10 lg:mb-13">
              <ul className="space-y-5">
                <li className="flex items-start">
                  <div className="w-7.5 h-7.5 bg-[#ffca0e] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <EditableText
                    contentKey="homepage_experience_1"
                    defaultValue="Over 10 års erfaring"
                    tag="h3"
                    className="text-lg font-semibold"
                  />
                </li>
                
                <li className="flex items-end">
                  <div className="w-7.5 h-7.5 bg-[#ffca0e] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <EditableText
                    contentKey="homepage_experience_2"
                    defaultValue="Erfaring fra henvisningshospitaler i København"
                    tag="h3"
                    className="text-lg font-semibold"
                  />
                </li>
                
                <li className="flex items-end">
                  <div className="w-7.5 h-7.5 bg-[#ffca0e] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <EditableText
                    contentKey="homepage_experience_3"
                    defaultValue="Dyrlæge for politiets tjenestehunde"
                    tag="h3"
                    className="text-lg font-semibold"
                  />
                </li>
              </ul>
            </div>
            
            <div>
              <Link href="/om">
                <Button size={"lg"}>
                  Mere om mig
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-15 bg-[#611471] text-white">
         <div className="flex flex-col max-w-[1257px] mx-auto lg:flex-row items-center justify-between">
           <div className="">
             <EditableText
               contentKey="homepage_cta_title"
               defaultValue="Book en aftale allerede i dag"
               tag="h2"
               multiline={true}
               className="text-3xl md:text-3xl lg:text-5xl leading-10 font-extrabold mb-6"
             />

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/kontakt">
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
    </div>
  );
}
