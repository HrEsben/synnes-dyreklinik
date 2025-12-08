import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GDPR & Privatlivspolitik - Synnes Dyreklinik',
  description: 'Læs om hvordan Synnes Dyreklinik behandler dine personoplysninger i overensstemmelse med GDPR.',
}

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-15 lg:pt-20 px-4 md:px-6 bg-[#fffaf6] curved-bottom">
        <div className="mx-auto max-w-[1257px]">
          <div className="text-center">
            <h1 className="mb-6" style={{ 
              fontWeight: 800, 
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: '1.2em',
              color: '#2c2524'
            }}>
              GDPR
            </h1>
            <p className="text-lg font-medium max-w-3xl mx-auto" style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#817d7d',
              lineHeight: '1.7em'
            }}>
              Vi indsamler de personoplysninger, som du selv giver os. Vi indhenter ikke oplysninger fra tredjemand eller hos offentlige myndigheder.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-15 px-4 md:px-6">
        <div className="mx-auto max-w-[800px] prose prose-lg">
          
          {/* Dataansvarlig */}
          <div className="mb-12">
            <h2 className="mb-6" style={{ 
              fontWeight: 800, 
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontSize: '32px',
              color: '#2c2524'
            }}>
              Dataansvarlig
            </h2>
            <div className="text-gray-700 space-y-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <p>Vi er dataansvarlig for behandlingen af de personoplysninger, som vi behandler om vores kunder og samarbejdspartnere. Du finder vores kontaktoplysninger nedenfor.</p>
              
              <div className="bg-[#fffaf6] p-6 rounded-lg">
                <p className="font-semibold mb-2">Synnes Dyreklinik</p>
                <p>Blommevej 9, 4070 Kirke Hyllinge</p>
                <p>CVR-nr.: 44032864</p>
              </div>
              
              <p>Det er ikke et krav, at vores virksomhed har en ekstern DPO, men hvis du har spørgsmål til behandlingen af dine personoplysninger, så kan du kontakte os via <a href="mailto:synne@synnesdyreklinik.dk" className="text-[#f97561] hover:underline">synne@synnesdyreklinik.dk</a>.</p>
            </div>
          </div>

          {/* Behandlingsaktiviteter */}
          <div className="mb-12">
            <h2 className="mb-6" style={{ 
              fontWeight: 800, 
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontSize: '32px',
              color: '#2c2524'
            }}>
              Behandlingsaktiviteter
            </h2>
            <p className="mb-8 text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Som dataansvarlig jf. GDPR, så har vi følgende behandlingsaktiviteter.
            </p>

            {/* Besøg på hjemmeside */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ 
                fontWeight: 700, 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '24px',
                color: '#2c2524'
              }}>
                Besøg på hjemmeside
              </h3>
              <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Når du besøger vores hjemmeside, så anvender vi cookies for at hjemmesiden kan fungere, hvilket du kan læse mere om i vores cookiepolitik.
              </p>
            </div>

            {/* Kommunikation med potentielle kunder */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ 
                fontWeight: 700, 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '24px',
                color: '#2c2524'
              }}>
                Kommunikation med potentielle kunder
              </h3>
              <div className="text-gray-700 space-y-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <p>Når du har spørgsmål til vores side, eller ønsker at høre mere om vores services, så kan du kontakte os via:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Kontaktformular</li>
                  <li>Email</li>
                  <li>Telefon</li>
                </ul>
                <p>Herigennem vil vi behandle dine personoplysninger, så vi kan indgå i en dialog med dig fx svare på spørgsmål om vores ydelser. Vi behandler kun den information, som du giver os i forbindelse med vores kommunikation.</p>
                <p>Vi vil typisk behandle følgende almindelige oplysninger: navn, email, telefonnummer.</p>
                <p>Vores hjemmel til at behandle disse personoplysninger er databeskyttelsesforordningens artikel 6, stk. 1 litra f.</p>
                <p>Hvis du ønsker vores kommunikation slettet venligst kontakt os derom. Som standard opbevarer vi dine personoplysninger.</p>
              </div>
            </div>

            {/* Kunder */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ 
                fontWeight: 700, 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '24px',
                color: '#2c2524'
              }}>
                Kunder
              </h3>
              <div className="text-gray-700 space-y-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <p>Vi har behov for at kommunikere med vores kunder, så vi sikrer os, at ydelsen leveres korrekt. Herigennem kan vi behandle oplysninger om navn, adresse, ydelser, særlige aftaler, betalingsinformationer og lignende.</p>
                <p>Hjemlen til at behandle disse personoplysninger er databeskyttelsesforordningens artikel 6, stk. 1 litra b.</p>
                <p>Når ydelsen er leveret og eventuelle udestående er afsluttede, opbevares informationerne som standard. Ønskes dette ikke kontakt os venligst.</p>
                <p>Ved oplysning af email vil vi sende remindere ang vaccinationstid og lignende. Der vil ikke blive sendt reklame af nogen art.</p>
              </div>
            </div>

            {/* Bogføring */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ 
                fontWeight: 700, 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '24px',
                color: '#2c2524'
              }}>
                Bogføring
              </h3>
              <div className="text-gray-700 space-y-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <p>Vi skal gemme alle regnskabsbilag jf. bogføringsloven. Det betyder, at vi gemmer fakturaer og lignende bilag til brug for regnskabsføring. Heraf kan der fremgå almindelige personoplysninger som navn, adresse, ydelsesbeskrivelse.</p>
                <p>Vores hjemmel til at behandle personoplysninger til bogføringen er databeskyttelsesforordningens artikel 6, stk.1.</p>
                <p>Vi opbevarer disse oplysninger i minimum 5 år efter at indeværende regnskabsår er afsluttet.</p>
              </div>
            </div>

            {/* Jobansøgninger */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ 
                fontWeight: 700, 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '24px',
                color: '#2c2524'
              }}>
                Jobansøgninger
              </h3>
              <div className="text-gray-700 space-y-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <p>Vi tager glædeligt imod jobansøgninger med henblik på at vurdere om de matcher et ansættelsesbehov i vores virksomhed.</p>
                <p>Hvis du sender din jobansøgning til os, så er vores hjemmel til at behandle dine personoplysninger databeskyttelsesforordningens artikel 6, stk. 1 litra f.</p>
                <p>Hvis du har sendt en uopfordret ansøgning, så vil HR med det samme vurdere om din ansøgning er relevant, og herefter slette dine oplysninger igen, hvis der ikke er et match.</p>
                <p>Hvis du har sendt en ansøgning til et opslået job, så vil vi bortskaffe din ansøgning i det tilfælde, at du ikke ansættes, og umiddelbart efter at den rette kandidat er fundet til jobbet.</p>
                <p>Hvis du indgår i et rekrutteringsforløb og/eller ansættes til jobbet, så vil dine informationer blive gemt indtil afklaring.</p>
              </div>
            </div>
          </div>

          {/* Databehandlere */}
          <div className="mb-12">
            <h2 className="mb-6" style={{ 
              fontWeight: 800, 
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontSize: '32px',
              color: '#2c2524'
            }}>
              Databehandlere
            </h2>
            <div className="text-gray-700 space-y-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <p>Få kan klare alt selv, og det samme gælder os. Vi har derfor samarbejdspartnere, samt benytter os af leverandører, hvoraf nogle kan være databehandlere.</p>
              <p>Eksterne leverandører kan eksempelvis levere systemer til at organisere vores arbejde, services, rådgivning, IT-hosting eller markedsføring.</p>
              <p>Det er vores ansvar at sikre, at dine personoplysninger behandles ordentligt. Derfor stiller vi høje krav til vores samarbejdspartnere, og vores partnere skal garantere, at dine personoplysninger er beskyttet.</p>
              <p>Vi indgår derfor aftaler herom med virksomheder (databehandlere), der håndterer personoplysninger på vores vegne for at højne sikkerheden af dine personoplysninger.</p>
            </div>
          </div>

          {/* Øvrige sektioner */}
          <div className="space-y-12">
            <div>
              <h2 className="mb-4" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: '32px',
                color: '#2c2524'
              }}>
                Videregivelse af personoplysninger
              </h2>
              <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Vi videregiver ikke dine personoplysninger til tredjemand.
              </p>
            </div>

            <div>
              <h2 className="mb-4" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: '32px',
                color: '#2c2524'
              }}>
                Profilering og automatiserede afgørelser
              </h2>
              <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Vi foretager ikke profilering eller automatiserede afgørelser.
              </p>
            </div>

            <div>
              <h2 className="mb-4" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: '32px',
                color: '#2c2524'
              }}>
                Tredjelandeoverførsler
              </h2>
              <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Vi benytter som udgangspunkt databehandlere i EU/EØS, eller som opbevarer data i EU/EØS. I nogle tilfælde er dette ikke muligt, og her kan der benyttes databehandlere udenfor EU/EØS, hvis disse kan give dine personoplysninger en passende beskyttelse.
              </p>
            </div>

            <div>
              <h2 className="mb-4" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: '32px',
                color: '#2c2524'
              }}>
                Behandlingssikkerhed
              </h2>
              <div className="text-gray-700 space-y-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <p>Vi holder behandlingen af personoplysninger sikker ved at have indført passende tekniske og organisatoriske foranstaltninger.</p>
                <p>Vi har lavet risikovurderinger af vores behandling af personoplysninger, og har herefter indført passende tekniske og organisatoriske foranstaltninger for at øge behandlingssikkerheden.</p>
                <p>En af vores vigtigste foranstaltninger er at holde vores medarbejdere opdaterede om GDPR via løbende awareness træning samt ved at gennemgå vores GDPR-procedurer med medarbejderne.</p>
              </div>
            </div>
          </div>

          {/* De registreredes rettigheder */}
          <div className="mb-12">
            <h2 className="mb-6" style={{ 
              fontWeight: 800, 
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontSize: '32px',
              color: '#2c2524'
            }}>
              De registreredes rettigheder
            </h2>
            <p className="mb-8 text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Du har efter databeskyttelsesforordningen en række rettigheder i forhold til vores behandling af oplysninger om dig. Hvis du vil gøre brug af dine rettigheder, skal du kontakte os, så vi kan hjælpe dig med dette.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="mb-3" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '20px',
                  color: '#2c2524'
                }}>
                  Ret til at se oplysninger (indsigtsret)
                </h3>
                <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Du har ret til at få indsigt i de oplysninger, som vi behandler om dig, samt en række yderligere oplysninger.
                </p>
              </div>

              <div>
                <h3 className="mb-3" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '20px',
                  color: '#2c2524'
                }}>
                  Ret til berigtigelse (rettelse)
                </h3>
                <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Du har ret til at få urigtige oplysninger om dig selv rettet.
                </p>
              </div>

              <div>
                <h3 className="mb-3" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '20px',
                  color: '#2c2524'
                }}>
                  Ret til sletning
                </h3>
                <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  I særlige tilfælde har du ret til at få slettet oplysninger om dig, inden tidspunktet for vores almindelige generelle sletning indtræffer.
                </p>
              </div>

              <div>
                <h3 className="mb-3" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '20px',
                  color: '#2c2524'
                }}>
                  Ret til begrænsning af behandling
                </h3>
                <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Du har i visse tilfælde ret til at få behandlingen af dine personoplysninger begrænset. Hvis du har ret til at få begrænset behandlingen, må vi fremover kun behandle oplysningerne – bortset fra opbevaring – med dit samtykke, eller med henblik på at retskrav kan fastlægges, gøres gældende eller forsvares, eller for at beskytte en person eller vigtige samfundsinteresser.
                </p>
              </div>

              <div>
                <h3 className="mb-3" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '20px',
                  color: '#2c2524'
                }}>
                  Ret til indsigelse
                </h3>
                <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Du har i visse tilfælde ret til at gøre indsigelse mod vores ellers lovlige behandling af dine personoplysninger. Du kan også gøre indsigelse mod behandling af dine oplysninger til direkte markedsføring.
                </p>
              </div>

              <div>
                <h3 className="mb-3" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '20px',
                  color: '#2c2524'
                }}>
                  Ret til at transmittere oplysninger (dataportabilitet)
                </h3>
                <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Du har i visse tilfælde ret til at modtage dine personoplysninger i et struktureret, almindeligt anvendt og maskinlæsbart format samt at få overført disse personoplysninger fra én dataansvarlig til en anden uden hindring.
                </p>
                <p className="text-gray-700 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Du kan læse mere om dine rettigheder i Datatilsynets vejledning om de registreredes rettigheder, som du finder på <a href="https://www.datatilsynet.dk/" className="text-[#f97561] hover:underline">www.datatilsynet.dk</a>.
                </p>
              </div>

              <div>
                <h3 className="mb-3" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '20px',
                  color: '#2c2524'
                }}>
                  Tilbagetrækning af samtykke
                </h3>
                <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Når vores behandling af dine personoplysninger er baseret på dit samtykke, så har du ret til at trække dit samtykke tilbage.
                </p>
              </div>

              <div>
                <h3 className="mb-3" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '20px',
                  color: '#2c2524'
                }}>
                  Klage til Datatilsynet
                </h3>
                <p className="text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Du har ret til at indgive en klage til Datatilsynet, hvis du er utilfreds med den måde, vi behandler dine personoplysninger på. Du finder Datatilsynets kontaktoplysninger på <a href="https://www.datatilsynet.dk/" className="text-[#f97561] hover:underline">www.datatilsynet.dk</a>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
