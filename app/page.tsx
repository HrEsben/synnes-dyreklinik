import Link from "next/link";
import Image from "next/image";
import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button";
import InteractiveHero from "@/components/interactive-hero";
import BookingPopover from "@/components/booking-popover";
import EditableText from "@/components/editable-text";
import EditableImage from "@/components/editable-image";
import EditableVideo from "@/components/editable-video";
// import InstagramFeed from "@/components/instagram-feed"; // Use this for Instagram API integration
// import InstagramFeed from "@/components/instagram-feed-simple"; // Using simple static version
// import InstagramFeed from "@/components/instagram-curated-feed"; // Using oEmbed version
// import InstagramFeed from "@/components/instagram-mock-feed"; // Using mockup to show how it would look
import InstagramFeed from "@/components/instagram-polaroid-feed"; // Using polaroid style
import GoogleReviews from "@/components/google-reviews";
import Divider from "@/components/divider";

export const metadata = {
  title: 'Synnes Dyreklinik - Velkommen',
  description: 'Erfaren dyrlæge med passion for familiens dyr og dyrenes familier. Med fokus på faglighed, fleksibilitet og tryghed hjælper jeg dig og dine dyr.',
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch site content server-side
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content_key, content')
    .in('content_key', [
      'homepage_hero_title',
      'homepage_hero_description',
      'homepage_about_title',
      'homepage_about_description',
      'homepage_services_title',
      'homepage_services_description',
      'contact_heading',
      'opening_hours_heading',
      'opening_hours',
      'location_heading',
      'location',
      'about_me_heading',
      'about_me_intro'
    ])

  // Create a content map for easy lookup
  const contentMap = (siteContent || []).reduce((acc, item) => {
    acc[item.content_key] = item.content
    return acc
  }, {} as Record<string, string>)

  // Helper function to get content with fallback
  const getContent = (key: string, fallback: string) => contentMap[key] || fallback

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-10 lg:py-20 px-4 md:px-6 bg-[#fffaf6] overflow-hidden curved-bottom min-h-[600px] lg:min-h-[700px]">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center relative text-center lg:text-left">
            <div className="order-1 lg:order-1">
              <EditableText
                contentKey="homepage_hero_title"
                defaultValue={getContent('homepage_hero_title', 'Velkommen hos Synnes Dyreklinik')}
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
                defaultValue={getContent('homepage_hero_description', 'Jeg er en erfaren dyrlæge med passion for familiens dyr og dyrenes familier. Med fokus på faglighed, fleksibilitet og tryghed hjælper jeg dig og dine dyr.')}
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
                <BookingPopover>
                  <Button size={"lg"}>
                    Book tid
                  </Button>
                </BookingPopover>
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
 <section className="lg:pt-35.5 pt-24 pb-25 lg:pb-24 max-w-[1257px] mx-auto">
  <div className="flex flex-col md:flex-row justify-between mx-6 lg:mx-0">
    <div className="flex flex-row md:flex-col lg:flex-row mb-12 md:mb-0">
      <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0 w-[80px] h-[78px] flex-shrink-0">
        <Image 
          src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/letter-icon.svg" 
          alt="Kontakt klinikken" 
          width={80} 
          height={78}
          priority
        />
      </div>
      <div>
      <EditableText 
        contentKey="contact_heading" 
        defaultValue={getContent('contact_heading', 'Kontakt os')}
        tag="h2"
        className="font-semibold text-xl mb-5.5 leading-tight tracking-tight"
      />
      <Link href="mailto:info@synnesdyreklinik.dk">
      <p className="text-lg font-semibold text-muted-foreground hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300 leading-0 underline">info@synnesdyreklinik.dk</p>
      </Link><br />
      <Link href="tel:+4549400599">
        <p className="text-lg font-semibold text-muted-foreground hover:text-[#f97561] hover:translate-x-1 transition-transform duration-300 leading-0 underline">+45 49 40 05 99</p>
      </Link>
      </div>
    </div>
    <div className="flex flex-row md:flex-col lg:flex-row mb-12 md:mb-0">
      <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0 w-[80px] h-[78px] flex-shrink-0">
        <Image 
          src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/clock-icon.svg" 
          alt="Åbningstider" 
          width={80} 
          height={78}
          priority
        />
      </div>
      <div>
      <EditableText 
        contentKey="opening_hours_heading" 
        defaultValue={getContent('opening_hours_heading', 'Åbningstider')}
        tag="h2"
        className="font-semibold text-xl mb-5.5 leading-tight tracking-tight"
      />
      <div className="text-lg font-semibold text-muted-foreground leading-6">
        <span className="text-secondary-foreground">Konsultation:</span><br />
        <EditableText 
          contentKey="opening_hours" 
          defaultValue={getContent('opening_hours', 'Hverdage kl. 8-16')}
          className="text-lg font-semibold text-muted-foreground leading-6"
        />
      </div>
      </div>
    </div>
    <div className="flex flex-row md:flex-col lg:flex-row mb-0">
      <div className="mr-9 lg:mr-6 mb-0 md:mb-5 lg:mb-0">
        <Image src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/icons/map-pin-icon.svg" alt="Kontakt klinikken" width={80} height={78} /></div>
      <div>
      <EditableText 
        contentKey="location_heading" 
        defaultValue={getContent('location_heading', 'Lokation')}
        tag="h2"
        className="font-semibold text-xl mb-5.5 leading-tight tracking-tight"
      />
      <EditableText 
        contentKey="location" 
        defaultValue={getContent('location', 'Gammel Skolevej 5, Ejby<br />4070 Kirke Hyllinge')}
        className="text-lg font-semibold text-muted-foreground leading-6"
        multiline={true}
        allowHtml={true}
      />
      </div>
    </div>
  </div>
 </section>
 <Divider />
      {/* About Section */}
      <section className="py-25 px-6 bg-[#fffaf6]">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="order-2 lg:order-1">
            <EditableVideo
              videoKey="about-video-url"
              thumbnailKey="about-video-thumbnail"
              videoUrl="https://youtu.be/bgLpqrR8R2M?si=MpmEvf-klqoC6yZQ"
              fallbackThumbnail="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/synneanddog.jpg"
              alt="Video om Synne og klinikken"
              width={488}
              height={574}
              className="rounded-4xl -rotate-4"
              style={{ width: 'auto', height: 'auto' }}
              isAuthenticated={!!user}
              editable={true}
              priority={true}
              fetchPriority="high"
            />
          </div>
          <div className="order-1 lg:order-2 mb-16 mx-8 w-full md:w-[611px] lg:max-w-[45%]">
            <EditableText 
              contentKey="about_me_heading" 
              defaultValue={getContent('about_me_heading', 'Kort om os...')}
              tag="h2"
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-accent-foreground mb-2.5 lg:mb-6"
            />
            <div className="mb-5 lg:mb-6">
              <EditableText 
                contentKey="about_me_intro" 
                defaultValue={getContent('about_me_intro', 'Mit navn er Synne Fyhn Stephansen. Jeg blev uddannet dyrlæge i 2009. Min erfaring spænder bredt. Jeg varetager både medicinske udredninger, kirurgiske indgreb samt tandbehandlinger. Jeg tilser de fleste typer patienter.')}
                className="text-muted-foreground text-lg font-semibold leading-8"
                multiline={true}
                tag="p"
              />
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
              
              <li className="flex items-start">
                <div className="w-7.5 h-7.5 bg-[#ffca0e] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">
                  Erfaring fra henvisningshospitaler i København
                </h3>
              </li>
              
              <li className="flex items-start">
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
                Mere om os
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </section>
      <Divider />

      {/* Instagram Section */}
      <section className="py-25 px-6 bg-white">
        <div className="max-w-[1257px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-accent-foreground mb-4">
              Følg os på Instagram
            </h2>
            <p className="text-lg font-semibold text-muted-foreground max-w-2xl mx-auto">
              Få et kig ind i klinikkens hverdag og mød nogle af vores pelsede venner.
            </p>
          </div>
          <InstagramFeed limit={6} />
        </div>
      </section>
      <Divider />
            {/* Google Reviews Section */}
      <GoogleReviews 
        placeId="ChIJk-lvg5djUkYRB0ngfTM2oL4" 
        useMyBusinessAPI={false}  // Use compliant Places API
        maxReviews={3} 
        className="bg-[#fffaf6]" 
      />
      <Divider />
      {/* CTA Section */}
      <section className="pt-15 lg:pb-6 bg-[#611471] text-white relative">
         <div className="flex flex-col max-w-[1257px] mx-auto px-6 lg:flex-row items-center justify-between">
           <div className="w-full lg:w-auto mb-8 lg:mb-0">
             <EditableText 
               contentKey="cta_title" 
               defaultValue="Vi glæder os til at tage godt<br />imod dig og dit kæledyr"
               className="text-3xl md:text-3xl lg:text-5xl leading-10 font-extrabold mb-6 text-white"
               multiline={true}
               tag="h2"
               allowHtml={true}
             />

          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-12">
            <BookingPopover>
              <Button className="py-5.5 px-5 text-lg font-bold w-full sm:w-auto">
                Book en tid
              </Button>
            </BookingPopover>
          </div>
          </div>
        
          
          <div className="flex-shrink-0 self-end lg:absolute lg:bottom-0 lg:right-6">
             <EditableImage
               imageKey="hero-synne-portrait"
               fallbackSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/sideeye_synne.webp"
               alt="Synne dyrlæge"
               width={600}
               height={400}
                          isAuthenticated={!!user}
               editable={true}
             />
          </div>
        </div>
      </section>
      <Divider />
    </div>
  );
}
