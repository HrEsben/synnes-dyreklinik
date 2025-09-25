import ServiceCard from "@/components/service-card";
import Divider from "@/components/divider";
import StickyAnchorNav from "@/components/sticky-anchor-nav";
import { 
  LucideDna, 
  Scissors, 
  Fish, 
  Cat, 
  Tag,
  TestTube,
  Dog
} from "lucide-react";

export const metadata = {
  title: "Ydelser - Synnes Dyreklinik",
  description: "Se vores omfattende udvalg af veterinære ydelser. Fra tumorer og knuder til kloklip og neutralisation - vi står klar til at hjælpe dit kæledyr.",
};

const services = [
  { id: "tumorer", label: "Tumorer / knuder", href: "#tumorer", icon: <LucideDna className="w-4 h-4" /> },
  { id: "kloklip", label: "Kloklip", href: "#kloklip", icon: <Scissors className="w-4 h-4" /> },
  { id: "foder", label: "Foder & vejledning", href: "#foder", icon: <Fish className="w-4 h-4" /> },
  { id: "neutralisation-kat", label: "Neutralisation af kat", href: "#neutralisation-kat", icon: <Cat className="w-4 h-4" /> },
  { id: "maerkning", label: "Mærkning", href: "#maerkning", icon: <Tag className="w-4 h-4" /> },
  { id: "kastration-hund", label: "Kastration af hund", href: "#kastration-hund", icon: <TestTube className="w-4 h-4" /> },
  { id: "sterilisation-taeve", label: "Sterilisation af tæve", href: "#sterilisation-taeve", icon: <Dog className="w-4 h-4" /> },
];

export default function YdelserPage() {
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
              Vi tilbyder et bredt spektrum af veterinære ydelser med fokus på tryghed, 
              omsorg og professionel behandling af dit kæledyr.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Anchor Navigation Menu */}
      <StickyAnchorNav services={services} />

      <Divider />

      {/* Services Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid gap-12">
            
            {/* Tumores / knuder */}
            <ServiceCard 
              id="tumorer"
              title="Tumores / knuder" 
              icon={<LucideDna className="w-6 h-6 text-white" />}
            >
              <p className="mb-4">
                Har du fundet en knude på dit kæledyr? Vi ved, det kan være bekymrende – 
                og vi står klar til at hjælpe jer trygt videre.
              </p>
              <p className="mb-4">
                Vi starter med en grundig undersøgelse og tager ofte en lille vævsprøve 
                (finnålsaspirat) for at vurdere, om knuden er godartet eller kræver yderligere behandling. 
                Har vi brug for en mere detaljeret vurdering, samarbejder vi med erfarne cytologer.
              </p>
              <p className="mb-4">
                Ud fra undersøgelsen og prøvesvaret lægger vi en plan – enten for videre udredning 
                eller, hvis det er nødvendigt, for kirurgisk fjernelse.
              </p>
              <p className="mb-4">
                Bliver knuden opereret væk, sender vi den til endelig analyse. Det giver os præcis 
                viden om typen af knude, prognosen fremadrettet og om hele knuden er blevet fjernet.
              </p>
              <p>
                Hvis operation ikke ønskes eller anbefales, hjælper vi selvfølgelig med at udarbejde 
                en god og tryg plan for dit kæledyr.
              </p>
            </ServiceCard>

            {/* Kloklip */}
            <ServiceCard 
              id="kloklip"
              title="Kloklip – med omsorg og tryghed i fokus" 
              icon={<Scissors className="w-6 h-6 text-white" />}
            >
              <p className="mb-4">
                Vi hjælper hjertens gerne med at klippe kløerne på din hund, kat, kanin, 
                marsvin eller fugl.
              </p>
              <p className="mb-4">
                Hos os er det vigtigt, at kloklip bliver en god og tryg oplevelse – både for dit 
                kæledyr og for dig. Vi arbejder efter fear free-principper, hvilket betyder, 
                at vi altid gør vores bedste for at undgå unødig fastholdelse eller fiksering.
              </p>
              <p className="mb-4">
                I stedet bruger vi godbidder, slikkemåtter og pauser – og tilpasser vores 
                tilgang til netop dit dyr. Nogle dyr har brug for lidt ekstra tid eller en 
                mere legende tilgang, og det tager vi os gerne tid til.
              </p>
              <p className="mb-4">
                Hvis kloklip ikke kan gennemføres uden stress for dyret, anbefaler vi 
                beroligende medicin – og i sådanne tilfælde kan det være nødvendigt at 
                booke en ny tid.
              </p>
              <p>
                Hos os handler kloklip ikke bare om klør – men om tillid, tryghed og 
                gode oplevelser.
              </p>
            </ServiceCard>

            {/* Foder og fodringsvejledning */}
            <ServiceCard 
              id="foder"
              title="Foder og fodringsvejledning" 
              icon={<Fish className="w-6 h-6 text-white" />}
            >
              <p className="mb-4">
                På klinikken forhandler vi SPECIFIC-foder til både hunde og katte. Det er et 
                kvalitetsfoder baseret på en dansk opskrift og produceret i Europa – med fokus 
                på både sundhed og bæredygtighed.
              </p>
              <p className="mb-4">
                SPECIFIC bruger fisk som primær proteinkilde, hvilket giver et naturligt højt 
                indhold af Omega-3 fedtsyrer. Omega-3 bidrager bl.a. til sund hud og pels, 
                smidige led, et stærkt immunforsvar samt en god udvikling af hjerne og øjne – 
                og det fremmer samtidig hjertesundheden. Fiskene i foderet fanges med omtanke for miljøet.
              </p>
              <p className="mb-4">
                Uanset om dit kæledyr har brug for foder til et bestemt livsstadie, skal tabe sig, 
                eller har en sygdom, der kræver særlig ernæring, står vi klar til at hjælpe dig 
                med at finde det rette foder – og lægge en plan, der passer til netop jeres behov.
              </p>
              <p className="mb-4">
                Har vi ikke det ønskede foder på lager, bestiller vi det gerne hjem – enten til 
                klinikken eller direkte til din hjemmeadresse.
              </p>
              <p>
                Du er også altid velkommen til at kigge forbi og få dit dyr vejet – helt uden 
                tidsbestilling.
              </p>
            </ServiceCard>

            {/* Neutralisation af kat */}
            <ServiceCard 
              id="neutralisation-kat"
              title="Neutralisation af kat – sterilisation eller kastration" 
              icon={<Cat className="w-6 h-6 text-white" />}
            >
              <p className="mb-4">
                En enkelt kat kan hurtigt blive til mange. Katte kommer typisk i løbetid, 
                når dagene bliver længere – ofte allerede i det tidlige forår. Derfor anbefaler vi, 
                at du får din kat neutraliseret inden marts.
              </p>
              <p className="mb-4">
                Ved tidlig sterilisation af hunkatte kan indgrebet ofte foretages som et 
                flankesnit – et lille snit i siden, hvor æggestokkene fjernes. Det giver typisk 
                færre gener for katten, og mange er hurtigt på benene igen. Er katten større, 
                foretages operationen i stedet via et snit midt på maven.
              </p>
              <p className="mb-4">
                Efter sterilisation får hunkatte tilbudt en bodystocking eller skærm for at 
                undgå, at de slikker i såret – mens hankatte som regel klarer sig fint uden.
              </p>
              <p className="mb-4">
                Vi anbefaler samtidig at få din kat mærket i forbindelse med neutralisationen. 
                Det er både praktisk og vigtigt for at sikre, at katten altid kan identificeres. 
                Læs mere under &ldquo;Mærkning af dit kæledyr&rdquo;.
              </p>
              <p>
                Det er også oplagt at starte vaccinationsprogrammet, når katten alligevel er 
                i narkose – så slipper den for unødige ekstra ture til klinikken.
              </p>
            </ServiceCard>

            {/* Mærkning af dit kæledyr */}
            <ServiceCard 
              id="maerkning"
              title="Mærkning af dit kæledyr" 
              icon={<Tag className="w-6 h-6 text-white" />}
            >
              <p className="mb-4">
                For hunde er det lovpligtigt at blive chipmærket og registreret i Dansk 
                Hunderegister inden de fylder 8 uger.
              </p>
              <p className="mb-4">
                Selvom der ikke er lovkrav for andre kæledyr, anbefaler vi alligevel mærkning 
                af alle dyr – både for at sikre ejerskab og for at gøre det muligt at finde hjem, 
                hvis dyret skulle blive væk eller komme til skade.
              </p>
              <p className="mb-4">
                Chipmærkning er den mest anvendte metode. Den kræver ikke bedøvelse og kan 
                foretages hurtigt og skånsomt. Chippen scanner vi nemt med en lille læser, 
                og oplysningerne bliver registreret i det relevante register.
              </p>
              <p className="mb-4">
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
            </ServiceCard>

            {/* Kemisk eller kirurgisk kastration af hund */}
            <ServiceCard 
              id="kastration-hund"
              title="Kemisk eller kirurgisk kastration af hund" 
              icon={<TestTube className="w-6 h-6 text-white" />}
            >
              <p className="mb-4">
                Der kan være flere grunde til at overveje kastration – men det er vigtigt at 
                vide, at ikke alle adfærds- eller helbredsmæssige problemer bliver bedre af det. 
                Derfor tager vi altid en grundig snak med jer, inden vi sammen beslutter, 
                om kastration er det rette for jeres hund.
              </p>
              <p className="mb-4">
                Hvis det vurderes relevant, kan man vælge mellem kemisk kastration og 
                kirurgisk kastration.
              </p>
              <p className="mb-4">
                <strong>Kemisk kastration</strong> kræver ingen bedøvelse og varer enten 6 eller 12 måneder. 
                Den er reversibel, hvilket betyder, at man kan &ldquo;mærke efter&rdquo;, om kastration har 
                den ønskede effekt – uden at tage en endelig beslutning med det samme.
              </p>
              <p className="mb-4">
                <strong>Kirurgisk kastration</strong> er permanent og foretages under bedøvelse. Efter 
                operationen skal hunden holdes i ro i 7–10 dage og bruge krave eller bodystocking 
                for at beskytte såret.
              </p>
              <p className="mb-4">
                Vi anbefaler som udgangspunkt, at hunden er mindst 1 år gammel, inden den 
                kastreres – for at sikre, at den har haft mulighed for at udvikle sig fysisk 
                og mentalt.
              </p>
              <p className="mb-4">
                Efter kastration er det vigtigt at holde øje med vægten, da stofskiftet ændrer sig. 
                Vi anbefaler derfor et foder med lavere energiindhold og regelmæssig vejning. 
                Nogle oplever også pelsforandring efter operationen.
              </p>
              <p>
                Har du spørgsmål eller overvejer kastration, er du altid velkommen til at 
                kontakte os – vi hjælper jer gerne med at finde den bedste løsning for 
                netop jeres hund.
              </p>
            </ServiceCard>

            {/* Sterilisation af tæve */}
            <ServiceCard 
              id="sterilisation-taeve"
              title="Sterilisation af tæve" 
              icon={<Dog className="w-6 h-6 text-white" />}
            >
              <p className="mb-4">
                Sterilisation kan være et godt valg for mange hunde, men det er vigtigt at 
                kende både fordele og ulemper, før beslutningen træffes. Vi tager derfor altid 
                en grundig snak med jer, så vi sammen finder den bedste løsning for netop 
                jeres hund.
              </p>
              <p className="mb-4">
                En sterilisation forhindrer, at tæven kommer i løbetid og dermed også i at 
                blive drægtig. Risikoen for knuder i mælkekirtlerne reduceres betydeligt, 
                og hun kan ikke udvikle livmoderbetændelse – en alvorlig og potentielt 
                livstruende tilstand.
              </p>
              <p className="mb-4">
                Vi anbefaler, at tæven som minimum har haft sin første løbetid, inden hun 
                steriliseres. Operationen planlægges cirka fire måneder efter løbetidens første dag. 
                Ved indgrebet laver vi et snit midt på maven og fjerner både livmoder og æggestokke.
              </p>
              <p className="mb-4">
                Efter operationen skal tæven holdes i ro i 7–10 dage og bære enten krave eller 
                bodystocking for at beskytte såret. Vi tilbyder ikke sterilisation som kikkertoperation.
              </p>
              <p className="mb-4">
                Efter sterilisation er det vigtigt at holde øje med vægten, da stofskiftet 
                ændrer sig. Vi anbefaler derfor et foder med lavere energiindhold og regelmæssig vejning.
              </p>
              <p className="mb-4">
                Hos nogle tæver kan pelsen ændre sig, og på ældre dage kan der – hos enkelte – 
                opstå inkontinens. Heldigvis kan dette oftest behandles medicinsk.
              </p>
              <p>
                Har du spørgsmål eller overvejer sterilisation, er du altid velkommen til at 
                kontakte os – vi hjælper jer gerne med at træffe det rette valg for din hund.
              </p>
            </ServiceCard>

          </div>
        </div>
      </section>

      <Divider />

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px] text-center">
          <h2 className="mb-6 text-3xl lg:text-4xl font-bold text-accent-foreground">
            Har du spørgsmål til vores ydelser?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vi står altid klar til at hjælpe dig og dit kæledyr. Kontakt os for en uforpligtende snak 
            om, hvilke ydelser der passer bedst til jeres behov.
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