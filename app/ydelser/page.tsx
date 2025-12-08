import ServiceCard from "@/components/service-card";
import Divider from "@/components/divider";
import StickyAnchorNav from "@/components/sticky-anchor-nav";
import { createClient } from '@/lib/supabase/server'
import { 
  LucideDna, 
  Scissors, 
  Fish, 
  Cat, 
  Tag,
  TestTube,
  Dog,
  Syringe,
  Stethoscope,
  Activity,
  Scan,
  FlaskConical,
  Rabbit,
  Heart,
  ShoppingBag
} from "lucide-react";

export const metadata = {
  title: "Ydelser - Synnes Dyreklinik",
  description: "Se vores omfattende udvalg af veterinære ydelser. Fra vaccinationer og operationer til konsultationer og specialbehandlinger - vi står klar til at hjælpe dit kæledyr.",
};

const services = [
  { id: "vaccinationer", label: "Vaccinationer", href: "#vaccinationer", icon: <Syringe className="w-4 h-4" /> },
  { id: "neutralisation-kat", label: "Neutralisation af kat", href: "#neutralisation-kat", icon: <Cat className="w-4 h-4" /> },
  { id: "kastration-hund", label: "Kastration af hund", href: "#kastration-hund", icon: <TestTube className="w-4 h-4" /> },
  { id: "sterilisation-taeve", label: "Sterilisation af tæve", href: "#sterilisation-taeve", icon: <Dog className="w-4 h-4" /> },
  { id: "tumorer", label: "Knuder / tumorer", href: "#tumorer", icon: <LucideDna className="w-4 h-4" /> },
  { id: "kloklip", label: "Kloklip", href: "#kloklip", icon: <Scissors className="w-4 h-4" /> },
  { id: "foder", label: "Foder & vejledning", href: "#foder", icon: <Fish className="w-4 h-4" /> },
  { id: "maerkning", label: "Mærkning", href: "#maerkning", icon: <Tag className="w-4 h-4" /> },
  { id: "operation", label: "Operation", href: "#operation", icon: <Activity className="w-4 h-4" /> },
  { id: "tandbehandling", label: "Tandbehandling", href: "#tandbehandling", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "konsultation", label: "Konsultation", href: "#konsultation", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "ultralydsscanning", label: "Ultralydsscanning", href: "#ultralydsscanning", icon: <Scan className="w-4 h-4" /> },
  { id: "roentgen", label: "Røntgen", href: "#roentgen", icon: <Scan className="w-4 h-4" /> },
  { id: "blodproever", label: "Blodprøver & laboratorium", href: "#blodproever", icon: <FlaskConical className="w-4 h-4" /> },
  { id: "kaniner", label: "Kaniner", href: "#kaniner", icon: <Rabbit className="w-4 h-4" /> },
  { id: "fysiurgi", label: "Fysiurgisk hundeterapi", href: "#fysiurgi", icon: <Heart className="w-4 h-4" /> },
  { id: "haandkoeb", label: "Foder & håndkøbsprodukter", href: "#haandkoeb", icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "fear-free", label: "Fear Free", href: "#fear-free", icon: <Heart className="w-4 h-4" /> },
];

export default async function YdelserPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

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

      {/* Sticky Anchor Navigation Menu */}
      <StickyAnchorNav services={services} />

      <Divider />

      {/* Services Section */}
      <section className="py-16 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="flex flex-col gap-12">
            
            {/* 1. Vaccinationer */}
            <ServiceCard 
              id="vaccinationer"
              title="Vaccinationer" 
              icon={<Syringe className="w-6 h-6 text-white" />}
              titleKey="ydelser_vaccinationer_title"
              contentKey="ydelser_vaccinationer_content"
              imageKey="ydelser_vaccinationer_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent="<p class='mb-4'>Vaccination er en vigtig del af dit kæledyrs sundhedspleje. Vi tilbyder vaccinationer til hunde, katte og kaniner.</p><p class='mb-4'>Kontakt os for mere information om vaccinationsprogrammer.</p>"
            />

            {/* 2. Neutralisation af kat */}
            <ServiceCard 
              id="neutralisation-kat"
              title="Neutralisation af kat – sterilisation eller kastration" 
              icon={<Cat className="w-6 h-6 text-white" />}
              titleKey="ydelser_neutralisation_kat_title"
              contentKey="ydelser_neutralisation_kat_content"
              imageKey="ydelser_neutralisation_kat_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4">
                  En enkelt kat kan hurtigt blive til mange. Katte kommer typisk i løbetid, 
                  når dagene bliver længere – ofte allerede i det tidlige forår. Derfor anbefaler vi, 
                  at du får din kat neutraliseret inden marts.
                </p>
                <p class="mb-4">
                  Ved tidlig sterilisation af hunkatte kan indgrebet ofte foretages som et 
                  flankesnit – et lille snit i siden, hvor æggestokkene fjernes. Det giver typisk 
                  færre gener for katten, og mange er hurtigt på benene igen. Er katten større, 
                  foretages operationen i stedet via et snit midt på maven.
                </p>
                <p class="mb-4">
                  Efter sterilisation får hunkatte tilbudt en bodystocking eller skærm for at 
                  undgå, at de slikker i såret – mens hankatte som regel klarer sig fint uden.
                </p>
                <p class="mb-4">
                  Vi anbefaler samtidig at få din kat mærket i forbindelse med neutralisationen. 
                  Det er både praktisk og vigtigt for at sikre, at katten altid kan identificeres. 
                  Læs mere under &ldquo;Mærkning af dit kæledyr&rdquo;.
                </p>
                <p>
                  Det er også oplagt at starte vaccinationsprogrammet, når katten alligevel er 
                  i narkose – så slipper den for unødige ekstra ture til klinikken.
                </p>
              `}
            />

            {/* 3. Kastration af hund */}
            <ServiceCard 
              id="kastration-hund"
              title="Kemisk eller kirurgisk kastration af hund" 
              icon={<TestTube className="w-6 h-6 text-white" />}
              titleKey="ydelser_kastration_hund_title"
              contentKey="ydelser_kastration_hund_content"
              imageKey="ydelser_kastration_hund_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent={`
                <p class="mb-4">
                  Der kan være flere grunde til at overveje kastration – men det er vigtigt at 
                  vide, at ikke alle adfærds- eller helbredsmæssige problemer bliver bedre af det. 
                  Derfor tager vi altid en grundig snak med jer, inden vi sammen beslutter, 
                  om kastration er det rette for jeres hund.
                </p>
                <p class="mb-4">
                  Hvis det vurderes relevant, kan man vælge mellem kemisk kastration og 
                  kirurgisk kastration.
                </p>
                <p class="mb-4">
                  <strong>Kemisk kastration</strong> kræver ingen bedøvelse og varer enten 6 eller 12 måneder. 
                  Den er reversibel, hvilket betyder, at man kan &ldquo;mærke efter&rdquo;, om kastration har 
                  den ønskede effekt – uden at tage en endelig beslutning med det samme.
                </p>
                <p class="mb-4">
                  <strong>Kirurgisk kastration</strong> er permanent og foretages under bedøvelse. Efter 
                  operationen skal hunden holdes i ro i 7–10 dage og bruge krave eller bodystocking 
                  for at beskytte såret.
                </p>
                <p class="mb-4">
                  Vi anbefaler som udgangspunkt, at hunden er mindst 1 år gammel, inden den 
                  kastreres – for at sikre, at den har haft mulighed for at udvikle sig fysisk 
                  og mentalt.
                </p>
                <p class="mb-4">
                  Efter kastration er det vigtigt at holde øje med vægten, da stofskiftet ændrer sig. 
                  Vi anbefaler derfor et foder med lavere energiindhold og regelmæssig vejning. 
                  Nogle oplever også pelsforandring efter operationen.
                </p>
                <p>
                  Har du spørgsmål eller overvejer kastration, er du altid velkommen til at 
                  kontakte os – vi hjælper jer gerne med at finde den bedste løsning for 
                  netop jeres hund.
                </p>
              `}
            />

            {/* 4. Sterilisation af tæve */}
            <ServiceCard 
              id="sterilisation-taeve"
              title="Sterilisation af tæve" 
              icon={<Dog className="w-6 h-6 text-white" />}
              titleKey="ydelser_sterilisation_taeve_title"
              contentKey="ydelser_sterilisation_taeve_content"
              imageKey="ydelser_sterilisation_taeve_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4">
                  Sterilisation kan være et godt valg for mange hunde, men det er vigtigt at 
                  kende både fordele og ulemper, før beslutningen træffes. Vi tager derfor altid 
                  en grundig snak med jer, så vi sammen finder den bedste løsning for netop 
                  jeres hund.
                </p>
                <p class="mb-4">
                  En sterilisation forhindrer, at tæven kommer i løbetid og dermed også i at 
                  blive drægtig. Risikoen for knuder i mælkekirtlerne reduceres betydeligt, 
                  og hun kan ikke udvikle livmoderbetændelse – en alvorlig og potentielt 
                  livstruende tilstand.
                </p>
                <p class="mb-4">
                  Vi anbefaler, at tæven som minimum har haft sin første løbetid, inden hun 
                  steriliseres. Operationen planlægges cirka fire måneder efter løbetidens første dag. 
                  Ved indgrebet laver vi et snit midt på maven og fjerner både livmoder og æggestokke.
                </p>
                <p class="mb-4">
                  Efter operationen skal tæven holdes i ro i 7–10 dage og bære enten krave eller 
                  bodystocking for at beskytte såret. Vi tilbyder ikke sterilisation som kikkertoperation.
                </p>
                <p class="mb-4">
                  Efter sterilisation er det vigtigt at holde øje med vægten, da stofskiftet 
                  ændrer sig. Vi anbefaler derfor et foder med lavere energiindhold og regelmæssig vejning.
                </p>
                <p class="mb-4">
                  Hos nogle tæver kan pelsen ændre sig, og på ældre dage kan der – hos enkelte – 
                  opstå inkontinens. Heldigvis kan dette oftest behandles medicinsk.
                </p>
                <p>
                  Har du spørgsmål eller overvejer sterilisation, er du altid velkommen til at 
                  kontakte os – vi hjælper jer gerne med at træffe det rette valg for din hund.
                </p>
              `}
            />

            {/* 5. Knuder / tumorer */}
            <ServiceCard 
              id="tumorer"
              title="Knuder / tumorer" 
              icon={<LucideDna className="w-6 h-6 text-white" />}
              titleKey="ydelser_tumorer_title"
              contentKey="ydelser_tumorer_content"
              imageKey="ydelser_tumorer_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent="<p class='mb-4'>Har du fundet en knude på dit kæledyr? Vi ved, det kan være bekymrende – og vi står klar til at hjælpe jer trygt videre.</p><p class='mb-4'>Vi starter med en grundig undersøgelse og tager ofte en lille vævsprøve (finnålsaspirat) for at vurdere, om knuden er godartet eller kræver yderligere behandling. Har vi brug for en mere detaljeret vurdering, samarbejder vi med erfarne cytologer.</p><p class='mb-4'>Ud fra undersøgelsen og prøvesvaret lægger vi en plan – enten for videre udredning eller, hvis det er nødvendigt, for kirurgisk fjernelse.</p><p class='mb-4'>Vi udfører alle operationer i vores moderne operationsstue med fuld monitorering under bedøvelsen. Samtidig prioriterer vi smertebehandling højt – både før, under og efter indgrebet.</p><p>Har I spørgsmål eller bekymringer, tøv ikke med at kontakte os. Vi tager jer i hånden gennem hele forløbet.</p>"
            />

            {/* 6. Kloklip */}
            <ServiceCard 
              id="kloklip"
              title="Kloklip – med omsorg og tryghed i fokus" 
              icon={<Scissors className="w-6 h-6 text-white" />}
              titleKey="ydelser_kloklip_title"
              contentKey="ydelser_kloklip_content"
              imageKey="ydelser_kloklip_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4">
                  Vi hjælper hjertens gerne med at klippe kløerne på din hund, kat, kanin, 
                  marsvin eller fugl.
                </p>
                <p class="mb-4">
                  Hos os er det vigtigt, at kloklip bliver en god og tryg oplevelse – både for dit 
                  kæledyr og for dig. Vi arbejder efter fear free-principper, hvilket betyder, 
                  at vi altid gør vores bedste for at undgå unødig fastholdelse eller fiksering.
                </p>
                <p class="mb-4">
                  I stedet bruger vi godbidder, slikkemåtter og pauser – og tilpasser vores 
                  tilgang til netop dit dyr. Nogle dyr har brug for lidt ekstra tid eller en 
                  mere legende tilgang, og det tager vi os gerne tid til.
                </p>
                <p class="mb-4">
                  Hvis kloklip ikke kan gennemføres uden stress for dyret, anbefaler vi 
                  beroligende medicin – og i sådanne tilfælde kan det være nødvendigt at 
                  booke en ny tid.
                </p>
                <p>
                  Hos os handler kloklip ikke bare om klør – men om tillid, tryghed og 
                  gode oplevelser.
                </p>
              `}
            />

            {/* 7. Foder og fodringsvejledning */}
            <ServiceCard 
              id="foder"
              title="Foder og fodringsvejledning" 
              icon={<Fish className="w-6 h-6 text-white" />}
              titleKey="ydelser_foder_title"
              contentKey="ydelser_foder_content"
              imageKey="ydelser_foder_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent={`
                <p class="mb-4">
                  På klinikken forhandler vi SPECIFIC-foder til både hunde og katte. Det er et 
                  kvalitetsfoder baseret på en dansk opskrift og produceret i Europa – med fokus 
                  på både sundhed og bæredygtighed.
                </p>
                <p class="mb-4">
                  SPECIFIC bruger fisk som primær proteinkilde, hvilket giver et naturligt højt 
                  indhold af Omega-3 fedtsyrer. Omega-3 bidrager bl.a. til sund hud og pels, 
                  smidige led, et stærkt immunforsvar samt en god udvikling af hjerne og øjne – 
                  og det fremmer samtidig hjertesundheden. Fiskene i foderet fanges med omtanke for miljøet.
                </p>
                <p class="mb-4">
                  Uanset om dit kæledyr har brug for foder til et bestemt livsstadie, skal tabe sig, 
                  eller har en sygdom, der kræver særlig ernæring, står vi klar til at hjælpe dig 
                  med at finde det rette foder – og lægge en plan, der passer til netop jeres behov.
                </p>
                <p class="mb-4">
                  Har vi ikke det ønskede foder på lager, bestiller vi det gerne hjem – enten til 
                  klinikken eller direkte til din hjemmeadresse.
                </p>
                <p>
                  Du er også altid velkommen til at kigge forbi og få dit dyr vejet – helt uden 
                  tidsbestilling.
                </p>
              `}
            />

            {/* 8. Mærkning af dit kæledyr */}
            <ServiceCard 
              id="maerkning"
              title="Mærkning af dit kæledyr" 
              icon={<Tag className="w-6 h-6 text-white" />}
              titleKey="ydelser_maerkning_title"
              contentKey="ydelser_maerkning_content"
              imageKey="ydelser_maerkning_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4">
                  For hunde er det lovpligtigt at blive chipmærket og registreret i Dansk 
                  Hunderegister inden de fylder 8 uger.
                </p>
                <p class="mb-4">
                  Selvom der ikke er lovkrav for andre kæledyr, anbefaler vi alligevel mærkning 
                  af alle dyr – både for at sikre ejerskab og for at gøre det muligt at finde hjem, 
                  hvis dyret skulle blive væk eller komme til skade.
                </p>
                <p class="mb-4">
                  Chipmærkning er den mest anvendte metode. Den kræver ikke bedøvelse og kan 
                  foretages hurtigt og skånsomt. Chippen scanner vi nemt med en lille læser, 
                  og oplysningerne bliver registreret i det relevante register.
                </p>
                <p class="mb-4">
                  Øretatovering er et alternativ, som gør det muligt at se med det blotte øje, 
                  at dyret er mærket. Dog kan tatoveringen med tiden blive svær at aflæse, 
                  og den kræver, at dyret er i bedøvelse. Ofte kombinerer vi chipmærkning med 
                  et lille &ldquo;C&rdquo; tatoveret i øret. Mærkede katte bliver herefter registreret i 
                  Dansk Katteregister.
                </p>
                <p>
                  Også andre dyr – som fx kaniner, marsvin, slanger og fugle – kan mærkes, 
                  hvis du ønsker det. Vi rådgiver dig gerne om, hvad der er muligt og mest 
                  hensigtsmæssigt for netop dit kæledyr.
                </p>
              `}
            />

            {/* 9. Operation */}
            <ServiceCard 
              id="operation"
              title="Operation" 
              icon={<Activity className="w-6 h-6 text-white" />}
              titleKey="ydelser_operation_title"
              contentKey="ydelser_operation_content"
              imageKey="ydelser_operation_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent={`
                <p class="mb-4">
                  På klinikken udfører vi dagligt en bred vifte af operationer. Vores primære mål er at sikre at du og dit kæledyr får den bedste og mest trygge oplevelse, uanset om det drejer sig om rutineoperationer eller andre kirurgiske indgreb.
                </p>
                <p class="mb-4">
                  Vi prioriterer faglighed og sikkerhed højt, og derfor vil spørge ind til dit dyrs helbred, og tilbyde en blodprøve før operationen (se mere under afsnittet blodprøver). Vi har primært "hold i pote tider", som betyder, at du som ejer er her når dyret får sin forbedøvelse, og derfor falder til ro i trygge og genkendelige arme.
                </p>
                <p class="mb-4">
                  Under selve operationen har vi fuld overvågning på, og en sygeplejerske som styrer narkose og smertebehandling, samt holder øje med værdierne for dit kæledyr:
                </p>
                <ul class="list-disc list-inside mb-4 ml-4">
                  <li>Puls</li>
                  <li>Blodtryk</li>
                  <li>Iltmætning</li>
                  <li>Kropstemperatur</li>
                  <li>Vejrtrækning</li>
                </ul>
                <p class="mb-4">
                  Efter operationen tilstræber vi at sende dit dyr hjem så snart det er forsvarligt. Dette for at dyret ikke oplever unødig stress, men hurtigt kommer hjem til dig og sine vante omgivelser. Vi kan også bede dig som ejer om at komme så snart dit dyr vågner og sidde med det indtil vi vurderer hjemsendelse er forsvarligt. Vi tilbyder kaffe, the eller kakao i ventetiden, men en god bog eller blad kan anbefales.
                </p>
                <p>
                  Når du henter dit kæledyr, vil du få en gennemgang af, hvordan det er gået med dagens operation, samt grundig information om, hvordan du skal forholde dig resten af dagen. Du vil også få information om yderligere behandling hjemme som sårpleje, medicinering mm.
                </p>
              `}
            />

            {/* 10. Tandbehandling */}
            <ServiceCard 
              id="tandbehandling"
              title="Tandbehandling" 
              icon={<Stethoscope className="w-6 h-6 text-white" />}
              titleKey="ydelser_tandbehandling_title"
              contentKey="ydelser_tandbehandling_content"
              imageKey="ydelser_tandbehandling_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4">
                  Tandsygdomme er nogle af de hyppigste lidelser vi ser hos hund og kat. En god mundhygiejne er vigtig for dit kæledyrs generelle sundhed og livskvalitet. På klinikken tilbyder vi tandrensning og tandekstraktioner på hund og kat samt tandslibning på kaniner.
                </p>
                <p class="mb-4">
                  En professionel tandrensning er den mest effektive måde at fjerne tandsten og plak. Vi undersøger alle tænderne for tandkødslommer, skader og mangler, renser samt efterpolerer alle tænder. Under vores tandrensninger tager vi røntgenbilleder af alle tænderne i munden, for at sikre at der ikke er sygdom under tandkødet, som vi ikke kan se med det blotte øje.
                </p>
                <p class="mb-4">
                  Ved sygdomme som parodontose, flækkede tænder eller tandresorptioner, kan det være nødvendigt at ekstrahere de påvirkede tænder.
                </p>
                <p class="mb-4">
                  Vores tandbehandlinger foregår i fuld narkose, som er overvåget af vores dygtige veterinærsygeplejersker. Se mere om fuld narkose i afsnittet "Operation".
                </p>
                <p>
                  Vi tilbyder altid gratis tandtjek på klinikken for din og dit kæledyrs tryghed.
                </p>
              `}
            />

            {/* 11. Konsultation */}
            <ServiceCard 
              id="konsultation"
              title="Konsultation" 
              icon={<Stethoscope className="w-6 h-6 text-white" />}
              titleKey="ydelser_konsultation_title"
              contentKey="ydelser_konsultation_content"
              imageKey="ydelser_konsultation_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent={`
                <p class="mb-4">
                  Konsultationer er en vigtig del af vores arbejde som dyreklinik. Det er her, vi lærer dit dyr at kende og kan finde den bedste plan for dit dyrs sundhed.
                </p>
                <p class="mb-4">
                  Ved en konsultation vil vi ofte starte med en samtale, hvor vi lytter til dine observationer og spørgsmål, og vi spørger ind til dyrets generelle sundhed. Herefter laver vi en grundig klinisk undersøgelse fra snude til hale, og kigger så nærmere på det, som er bekymringen for i dag.
                </p>
                <p class="mb-4">Vi kan bruge konsultationer til:</p>
                <ul class="list-disc list-inside mb-4 ml-4">
                  <li>Årlige sundhedstjek og vaccinationer</li>
                  <li>Udredning af sygdomme</li>
                  <li>Hud- og pelsproblemer</li>
                  <li>Øreundersøgelser</li>
                  <li>Øjenundersøgelser</li>
                  <li>Tandproblemer</li>
                  <li>Mave-tarm problemer</li>
                  <li>Akutte skader</li>
                </ul>
                <p class="mb-4">Og meget mere.</p>
                <p>
                  Hvis der er behov for yderligere diagnostik på dit kæledyr, finder vi i samråd med dig den bedste plan, så dit kæledyr er i trygge hænder.
                </p>
              `}
            />

            {/* 12. Konsultationer hos veterinærsygeplejerske */}
            <ServiceCard 
              id="sygeplejerske-konsultation"
              title="Konsultationer hos veterinærsygeplejerske" 
              icon={<Stethoscope className="w-6 h-6 text-white" />}
              titleKey="ydelser_sygeplejerske_title"
              contentKey="ydelser_sygeplejerske_content"
              imageKey="ydelser_sygeplejerske_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4">
                  Vores dygtige sygeplejersker har også konsultationer. De tager sig blandt andet af kloklip, tandtjek, sårkontroller og standard injektioner til ledsmerter eller allergi.
                </p>
                <p>
                  Hos Natasha kan man også få konsultationer ift. fysiurgisk hundeterapi (se dette specifikt).
                </p>
              `}
            />

            {/* 13. Ultralydsscanning */}
            <ServiceCard 
              id="ultralydsscanning"
              title="Ultralydsscanning" 
              icon={<Scan className="w-6 h-6 text-white" />}
              titleKey="ydelser_ultralydsscanning_title"
              contentKey="ydelser_ultralydsscanning_content"
              imageKey="ydelser_ultralydsscanning_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent={`
                <p class="mb-4">
                  En ultralydsscanner er et værdifuldt arbejdsredskab, som kan give os meget nyttig viden.
                </p>
                <p class="mb-4"><strong>Hvad kan man bruge ultralydsscanning til?</strong></p>
                <ul class="list-disc list-inside mb-4 ml-4">
                  <li>Drægtighedsscanninger og fastlæggelse af termin</li>
                  <li>Organscanninger – her kan vi gennemgå organerne i bughulen systematisk og se dem fra flere vinkler</li>
                  <li>Akutte scanninger for, om der er fri væske i bug- eller brysthule</li>
                  <li>Udtage sterile urinprøver direkte fra blæren</li>
                  <li>Udtage ultralydsguidede prøver fra forskellige organer</li>
                </ul>
                <p class="mb-4">
                  <strong>Hjertescanninger:</strong> Hvis dit kæledyr skal hjertescannes, henviser vi til en dygtig hjerte-dyrlæge som kan ultralydsscanne og lægge en fuld plan.
                </p>
                <p class="mb-4"><strong>Hvordan foregår en ultralydsscanning?</strong></p>
                <p>
                  En ultralydsscanning gør som udgangspunkt ikke ondt, dog kræver det bedste resultat at dit kæledyr ligger stille under undersøgelsen. Derfor kan det være nødvendigt at give en let bedøvelse til undersøgelsen.
                </p>
              `}
            />

            {/* 14. Røntgen */}
            <ServiceCard 
              id="roentgen"
              title="Røntgen" 
              icon={<Scan className="w-6 h-6 text-white" />}
              titleKey="ydelser_roentgen_title"
              contentKey="ydelser_roentgen_content"
              imageKey="ydelser_roentgen_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4">
                  På klinikken har vi mulighed for at tage røntgenbilleder af dit dyr og dermed få et billede af dets indre. Det er et vigtigt redskab til at stille præcise og hurtige diagnoser, og dermed give den bedste behandling.
                </p>
                <p class="mb-4"><strong>Hvad kan man bruge røntgen til?</strong></p>
                <ul class="list-disc list-inside mb-4 ml-4">
                  <li>Røntgen kan bruges ved knoglebrud eller ledsygdomme, som slidgigt eller medfødte vækstforstyrrelser</li>
                  <li>Det kan bruges til at finde fremmedlegemer, hvis din hund eller kat har spist noget den ikke burde</li>
                  <li>Problemer med indre organer, som forstørrede organer, tumorer eller væske i bug- eller brysthule eller give os et billede af lungernes tilstand</li>
                </ul>
                <p class="mb-4"><strong>Hvordan foregår røntgen?</strong></p>
                <p class="mb-4">
                  For at røntgenundersøgelsen bliver så behagelig og stressfri for dit kæledyr, får de ofte en let bedøvelse. Dette gør også at vi oftere kan placere patienterne til røntgenbillederne og gå ud af rummet for at tage billedet. Dette reducerer den stråling vi får, og sikrer dermed også vores sundhed. Samtidig forbedrer det billedernes kvalitet, og dermed værdien, at dyret ligger helt stille.
                </p>
                <p class="mb-4"><strong>Får man svar på røntgenbilleder med det samme?</strong></p>
                <p>
                  Vi vurderer selv hovedparten af vores røntgenbilleder. Nogle billeder sendes dog videre til specialister, hvormed der kan være lidt ventetid.
                </p>
              `}
            />

            {/* 15. Blodprøver og laboratorium */}
            <ServiceCard 
              id="blodproever"
              title="Blodprøver og laboratorium" 
              icon={<FlaskConical className="w-6 h-6 text-white" />}
              titleKey="ydelser_blodproever_title"
              contentKey="ydelser_blodproever_content"
              imageKey="ydelser_blodproever_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent={`
                <p class="mb-4">
                  På klinikken har vi vores eget laboratorium, der indeholder forskellige blodprøvemaskiner og mikroskop. Disse er vigtige værktøjer i vores dagligdag og det er en stor fordel, at vi hurtigt kan få blodprøveresultater ved at have maskinerne på klinikken. På den måde kan vi hurtigere vurdere og hjælpe dit kæledyr. Mere specialiserede prøver sender vi til et eksternt laboratorium.
                </p>
                <p class="mb-4"><strong>Hvad kan vi se på blodprøver?</strong></p>
                <p class="mb-4">Blodprøver kan bruges som et indvendigt sundhedstjek og give os en masse informationer som en almindelig sundhedsundersøgelse ikke kan:</p>
                <ul class="list-disc list-inside mb-4 ml-4">
                  <li>Organfunktioner: om nyrer, lever og bugspytkirtel virker som de skal</li>
                  <li>Infektion og inflammation: Om der er tegn på en betændelsestilstand i kroppen</li>
                  <li>Hormonelle ubalancer som stofskifteproblemer</li>
                  <li>Antallet af de røde og hvide blodlegemer, blodmangel, tegn på infektion mm.</li>
                  <li>Blodsukker</li>
                  <li>Elektrolytter, som har mange vigtige egenskaber i hele kroppen</li>
                  <li>Hjerteorm</li>
                </ul>
                <p class="mb-4"><strong>Hvornår anbefaler vi en blodprøve?</strong></p>
                <ul class="list-disc list-inside mb-4 ml-4">
                  <li><strong>Forebyggende sundhedstjek:</strong> Dette er specielt relevant for de ældre dyr, da risikoen for aldersrelaterede sygdomme stiger med tiden</li>
                  <li><strong>Før en operation (præ-blodprøve):</strong> For at sikre at dit dyr er sundt og klar til bedøvelse</li>
                  <li><strong>Hvis dit kæledyr er sygt:</strong> Her er blodprøverne en del af hele puslespillet i at finde ud af hvorfor dit dyr er sygt</li>
                </ul>
                <p class="mb-4"><strong>Urinprøver</strong></p>
                <p class="mb-4">I vores laboratorium kan vi også undersøge urinprøver, og få svar omkring tegn på infektioner, krystaller i urinen, sygdomme i urinvejene og meget mere.</p>
                <p class="mb-4"><strong>Afføringsprøver</strong></p>
                <p class="mb-4">Vi undersøger afføringsprøver for almindelige tarmorm (flotation), samt for hjerte- og lungeorm (baermann).</p>
                <p class="mb-4"><strong>Mikroskop</strong></p>
                <p>Vores mikroskop bruges på daglig basis – både til at undersøge afføringsprøver for orm, kigge urinprøver, se på blodceller eller prøver fra hud og ører.</p>
              `}
            />

            {/* 16. Kaniner */}
            <ServiceCard 
              id="kaniner"
              title="Kaniner" 
              icon={<Rabbit className="w-6 h-6 text-white" />}
              titleKey="ydelser_kaniner_title"
              contentKey="ydelser_kaniner_content"
              imageKey="ydelser_kaniner_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4">
                  Kaniner har særlige behov som skiller sig ud fra hund og kat. Som byttedyr er de mestre i at skjule sygdomme og smerte, hvilket betyder at problemerne hurtigt kan blive alvorlige, før de opdages.
                </p>
                <p class="mb-4">På vores dyreklinik har vi erfaring med at behandle kaniner, og forstår de unikke krav deres helbred stiller.</p>
                <p class="mb-4"><strong>Sundhedstjek og vaccination</strong></p>
                <p class="mb-4">For at sikre din kanins helbred anbefaler vi et sundhedstjek hver 6. måned. Her snakker vi om hvilke leveforhold kaninen har, fodring, bekymringer mm. Her får vi kigget kaninen igennem fra snude til hale for at sikre at den er sund og rask.</p>
                <p class="mb-4">Vi anbefaler vaccination af kaninen 1 gang årligt mod myxomatose (kaninpest) og VHD (viral hæmorragisk sygdom) som er to smitsomme sygdomme med dødelig udgang. De spredes via insekter og kan ramme både inde- og udekaniner.</p>
                <p class="mb-4"><strong>Neutralisering</strong></p>
                <p class="mb-4">Vi anbefaler at få din kanin neutraliseret. Både for at reducere pludselige kuld af nye unger, men også for at sikre at din kanin kan bondes med en ven og for at forhindre kræft i livmoder, æggestok og testikler.</p>
                <p class="mb-4">Ved operation af din kanin, vil vi have en dygtig veterinærsygeplejerske til at overvåge narkosen, mens dyrlægen opererer. Vi har fokus på smertebehandling, støtte af tarmsystemet og kaninens ve og vel undervejs og efter operationen.</p>
                <p class="mb-4"><strong>Tandbehandling</strong></p>
                <p class="mb-4">Vi laver tandtjek på kaniner og vurderer om deres bid er optimalt eller om de har forvoksede tandspidser eller tænder. På klinikken har vi mulighed for at slibe fortænder og kindtænder, og dermed sikre din kanins sundhed.</p>
                <p class="mb-4"><strong>Akut behandling</strong></p>
                <p>Hvis din kanin opfører sig anderledes eller pludselig bliver slap, trist eller ikke vil spise, anbefaler vi at du søger dyrlæge med det samme. Når kaninerne først viser tegn på at have det skidt, kan det hurtigt udvikle sig i en dårlig retning.</p>
              `}
            />

            {/* 17. Fysiurgisk hundeterapi */}
            <ServiceCard 
              id="fysiurgi"
              title="Fysiurgisk hundeterapi" 
              icon={<Heart className="w-6 h-6 text-white" />}
              titleKey="ydelser_fysiurgi_title"
              contentKey="ydelser_fysiurgi_content"
              imageKey="ydelser_fysiurgi_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent={`
                <p class="mb-4">
                  Vores sygeplejerske Natasha er snart færdig med sin 15-måneder lange uddannelse som Dyrlægeeksamineret Fysiurgisk Hundeterapeut.
                </p>
                <p class="mb-4">
                  Som uddannet fysiurgisk hundeterapeut, er hun i stand til at give massage, kranio sakral terapi og ledmobilisering. Hun har også en bred viden om andre fysioterapeutiske teknikker som rehabilitering mm.
                </p>
                <p class="mb-4">
                  Hendes viden er dyrebar og hun er en værdifuld sparringspartner for dyrlægerne ved patienter med smerter i bevægeapparatet.
                </p>
                <p>
                  Hun kan bookes specifikt til konsultationer, som inkluderer en samtale om dine bekymringer for dit kæledyr, en ganganalyse, en grundig gennemgang af dit kæledyrs muskler, led og bindevæv, hvorefter der bliver lagt den bedste plan for dit kæledyr. Dette kan blandt andet inkludere opfølgende konsultationer, massage og/eller øvelser hjemme.
                </p>
              `}
            />

            {/* 18. Foder og håndkøbsprodukter */}
            <ServiceCard 
              id="haandkoeb"
              title="Foder og håndkøbsprodukter" 
              icon={<ShoppingBag className="w-6 h-6 text-white" />}
              titleKey="ydelser_haandkoeb_title"
              contentKey="ydelser_haandkoeb_content"
              imageKey="ydelser_haandkoeb_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="right"
              defaultContent={`
                <p class="mb-4"><strong>Foder</strong></p>
                <p class="mb-4">
                  Hos Synnes Dyreklinik har vi et udvalg af foder fra SPECIFIC. De har en række diæter til forskellige behov – uanset om det er livsstadie diæter til unge, voksne eller ældre hunde, eller special-diæter, der er special designet til at støtte et specifikt formål.
                </p>
                <p class="mb-4">
                  SPECIFIC foderet er rigt på omega 3, da foderet er lavet på fisk. Omega 3 understøtter mange organsystemer i kroppen som hud, pels, led, hjerte, og øjnenes udvikling. De følger "Circle of Good" som omhandler bæredygtigt fanget fisk og genanvendelig emballage.
                </p>
                <p class="mb-4"><strong>Håndkøbsprodukter</strong></p>
                <p class="mb-4">Vi har et bredt udvalg af håndkøbsprodukter på klinikken:</p>
                <ul class="list-disc list-inside mb-4 ml-4">
                  <li>Støtte til mave-tarm-kanalen</li>
                  <li>Beroligende tilskud</li>
                  <li>Sårpleje</li>
                  <li>Ledtilskud</li>
                  <li>Ørepleje</li>
                  <li>Tandpleje som tandpasta og tandbørster</li>
                </ul>
                <p>Vi har også et udvalg af godbidder og tyggeben i god kvalitet, samt et udvalg af godbidder til hunde med specielle behov.</p>
              `}
            />

            {/* 19. Fear Free */}
            <ServiceCard 
              id="fear-free"
              title="Fear Free – stressfri dyrlægebesøg" 
              icon={<Heart className="w-6 h-6 text-white" />}
              titleKey="ydelser_fearfree_title"
              contentKey="ydelser_fearfree_content"
              imageKey="ydelser_fearfree_image"
              fallbackImageSrc="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/Placeholder_view.png"
              isAuthenticated={isAuthenticated}
              tiltDirection="left"
              defaultContent={`
                <p class="mb-4">
                  På Synnes Dyreklinik har vi fokus på at skabe positive oplevelser for dit kæledyr, ved at bruge stressfri håndtering og undgå tvang. Vores mål er at reducere frygt, angst og stress så du og dit kæledyr får et så roligt og positivt besøg som muligt.
                </p>
                <p class="mb-4">Som Fear Free inspireret dyreklinik sætter vi fokus på dyrenes følelsesmæssige velvære:</p>
                <ul class="list-disc list-inside mb-4 ml-4">
                  <li>Vi har fokus på at mindske dit kæledyrs uro før, under og efter besøget</li>
                  <li>Vi bruger en belønningsbaseret tilgang hvor godbidder og positiv forstærkning bruges til at distrahere og belønne dit kæledyr</li>
                  <li>Vi arbejder i et roligt tempo og giver dit kæledyr pauser hvis det er nødvendigt</li>
                  <li>Vi tilpasser besøget efter dit kæledyrs individuelle behov, temperament og stress signaler</li>
                </ul>
                <p class="mb-4">
                  Fordelene for dig er at vi kan få mere præcise diagnoser og behandlinger når dyret er roligt. Tilliden mellem dig og dit kæledyr forbliver intakt da dit kæledyr ikke tvinges gennem noget.
                </p>
                <p class="mb-4">
                  Den stressfrie tilgang har mange fordele uanset, om det er en hvalp/killing eller en voksen hund/kat med dårlige erfaringer i bagagen. For de unge dyr, gælder det om at putte en masse positive oplevelser i deres rygsæk, så de i fremtiden synes dyreklinikken er et godt sted at være.
                </p>
                <p class="mb-4">
                  Hos os er det vigtigt at klinikken og personalet i så vid grad er forbundet med noget positivt. Derfor er det vigtigt for os, ikke at overskride dit dyrs grænser, og vi ser altid dit dyr som et unikt individ med sine egne behov.
                </p>
                <p>
                  I er altid velkommen til at komme på besøg på klinikken til et hyggebesøg og en godbid. Hvis din hund eller kat synes det er svært at komme til dyrlægen, så ring eller skriv til os. Sammen lægger vi en god plan for besøget med dit dyrs oplevelse i fokus.
                </p>
              `}
            />

          </div>
        </div>
      </section>

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