-- Create services table for managing veterinary services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  icon TEXT NOT NULL DEFAULT 'Stethoscope',
  category TEXT NOT NULL DEFAULT 'basis',
  sort_order INTEGER NOT NULL DEFAULT 0,
  image_key TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster ordering
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON services
  FOR SELECT USING (true);

-- Allow authenticated users to manage services
CREATE POLICY "Allow authenticated insert" ON services
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON services
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON services
  FOR DELETE TO authenticated USING (true);

-- Insert default services
INSERT INTO services (slug, title, content, icon, category, sort_order, image_key) VALUES
  ('vaccinationer', 'Vaccinationer', 'Vaccinationer er en vigtig del af dit dyrs sundhedspleje. Vi tilbyder alle standard vaccinationer til hunde, katte og kaniner.

**Hunde vaccineres mod:**
- Hundesyge
- Parvovirus
- Smitsom hepatitis (leverbetændelse)
- Parainfluenza
- Leptospirose

**Katte vaccineres mod:**
- Kattesyge (Panleucopeni)
- Katteinfluenza (Calici- og Herpesvirus)

**Kaniner vaccineres mod:**
- Myxomatose
- RHD-1 og RHD-2 (kaningulsot)

Vi anbefaler at starte vaccinationsprogrammet når dit kæledyr er 8 uger gammelt, med opfølgende vaccinationer efter dyrlægens anvisning.', 'Syringe', 'basis', 1, 'service-vaccinationer'),

  ('maerkning', 'Mærkning (chip og øremærke)', 'Alle hunde skal ifølge dansk lovgivning ID-mærkes senest når de er 8 uger gamle. Vi tilbyder både mikrochip og øremærkning.

**Mikrochip:**
- En lille chip på størrelse med et riskorn implanteres under huden
- Chippen indeholder et unikt ID-nummer
- Kan aflæses med en scanner hos alle dyrlæger og på internater
- Registreres i Dansk Hunderegister

**Øremærke:**
- Tatovering i øret med et unikt nummer
- Den traditionelle metode til ID-mærkning

Vi anbefaler mikrochip, da det er den mest sikre og holdbare metode. Mærkningen er lovpligtig for hunde, men vi anbefaler det også til katte og kaniner.', 'Tag', 'basis', 2, 'service-maerkning'),

  ('kloklip', 'Kloklip', 'Regelmæssig kloklipning er vigtig for dit dyrs komfort og sundhed. For lange klør kan give smerter og i værste fald føre til skader.

**Vi tilbyder kloklip til:**
- Hunde
- Katte
- Kaniner og andre smådyr

**Hvornår skal klørne klippes?**
- Når du kan høre klørne klikke mod gulvet
- Hvis klørne begynder at bue
- Som tommelfingerregel hver 4-8 uge

Vores dyrlæger og sygeplejersker er trænede i skånsom kloklipning, også til nervøse dyr.', 'Scissors', 'basis', 3, 'service-kloklip'),

  ('foder', 'Foder', 'Vi fører et bredt udvalg af kvalitetsfoder og kan rådgive om det rette foder til netop dit dyr.

**Vi forhandler:**
- Royal Canin
- Hills Science Plan
- Specific
- Medicinsk diætfoder

**Hvornår er specialfoder relevant?**
- Ved overvægt
- Ved allergier eller foderintolerance
- Ved nyresygdom
- Ved diabetes
- Ved mave-tarm problemer
- Til ældre dyr med særlige behov

Vores personale kan hjælpe med at vælge det rette foder baseret på dit dyrs alder, race, aktivitetsniveau og eventuelle helbredsproblemer.', 'ShoppingBag', 'basis', 4, 'service-foder'),

  ('neutralisation-kat', 'Neutralisation af kat', 'Neutralisation (kastration af hankatte og sterilisation af hunkatte) er et almindeligt og sikkert indgreb.

**Fordele ved neutralisation:**
- Forebygger uønsket formering
- Reducerer strejfen og territoriel adfærd hos hankatte
- Eliminerer løbetid hos hunkatte
- Reducerer risikoen for livmoderbetændelse
- Reducerer risikoen for brystkræft hos hunkatte

**Praktisk information:**
- Katten skal faste fra aftenen før operationen
- Indgrebet foregår i fuld bedøvelse
- De fleste katte kan hentes samme dag
- Der gives smertestillende medicin med hjem

Vi anbefaler neutralisation fra 5-6 måneders alderen.', 'Cat', 'kirurgi', 5, 'service-neutralisation-kat'),

  ('kastration-hund', 'Kastration af hanhund', 'Kastration af hanhunde er et rutinemæssigt kirurgisk indgreb, hvor testiklerne fjernes.

**Fordele ved kastration:**
- Forebygger uønsket formering
- Kan reducere uønsket adfærd som strejfen og aggression
- Eliminerer risikoen for testikelkræft
- Reducerer risikoen for prostataproblemer

**Før operationen:**
- Hunden skal faste fra aftenen før
- Morgenmad må ikke gives
- Vand må gerne gives indtil 2 timer før

**Efter operationen:**
- De fleste hunde kan hentes samme dag
- Der udleveres smertestillende medicin
- Rolig aktivitet i 10-14 dage
- Kontrol af såret efter aftale', 'Dog', 'kirurgi', 6, 'service-kastration-hund'),

  ('sterilisation-taeve', 'Sterilisation af tæve', 'Sterilisation af tæver (også kaldet ovariohysterektomi) er et kirurgisk indgreb hvor æggestokke og livmoder fjernes.

**Fordele ved sterilisation:**
- Forebygger uønsket formering
- Eliminerer løbetid og blødninger
- Forebygger livmoderbetændelse (en potentielt livstruende tilstand)
- Reducerer kraftigt risikoen for brystkræft (især ved tidlig sterilisation)
- Eliminerer risikoen for æggestokkræft

**Praktisk information:**
- Tæven skal faste fra aftenen før
- Indgrebet foregår i fuld bedøvelse med overvågning
- Hospitalsophold til observation efter operationen
- Aktivitetsbegrænsning i 10-14 dage efter
- Fjernelse af sting efter 10-14 dage', 'Heart', 'kirurgi', 7, 'service-sterilisation-taeve'),

  ('tumorer', 'Knuder og tumorer', 'Knuder og tumorer hos kæledyr bør altid undersøges af en dyrlæge. Tidlig opdagelse og behandling forbedrer prognosen betydeligt.

**Undersøgelse af knuder:**
- Klinisk undersøgelse
- Finnålsaspiration (celleprøve)
- Eventuelt vævsprøve (biopsi)
- Røntgen eller ultralyd ved mistanke om spredning

**Behandlingsmuligheder:**
- Kirurgisk fjernelse
- Medicinsk behandling
- Palliativ behandling

**Hvornår bør du kontakte os?**
- Ved nye knuder eller buler
- Hvis en eksisterende knude vokser
- Ved sår der ikke vil hele
- Ved ændringer i appetit eller adfærd

Jo før en knude undersøges, jo bedre er mulighederne for behandling.', 'Activity', 'kirurgi', 8, 'service-tumorer'),

  ('operation', 'Operation', 'Vi udfører et bredt spektrum af kirurgiske indgreb i vores moderne operationsfaciliteter.

**Bløddelskirurgi:**
- Kastrationer og sterilisationer
- Fjernelse af tumorer og knuder
- Kejsersnit
- Mave-tarm operationer
- Blæreoperationer

**Ortopædisk kirurgi:**
- Korsbåndsoperationer
- Brud-behandling
- Patellaluksation

**Sikkerhed under operation:**
- Moderne anæstesiudstyr med overvågning
- Intravenøs væske under operationen
- Varmetæppe for at holde kroptemperaturen
- Smertebehandling før, under og efter

Alle operationer udføres af erfarne dyrlæger med fokus på sikkerhed og skånsom behandling.', 'Stethoscope', 'klinisk', 9, 'service-operation'),

  ('tandbehandling', 'Tandbehandling', 'God tandsundhed er afgørende for dit dyrs generelle helbred og velvære. Vi tilbyder komplet tandpleje.

**Tandundersøgelse:**
- Vurdering af tandsundhed
- Identificering af tandsten, løse tænder og tandkødsbetændelse

**Tandbehandling i fuld bedøvelse:**
- Professionel tandrensning med ultralyd
- Polering af tænder
- Udtrækning af syge tænder
- Røntgen af tænder ved behov

**Tegn på tandproblemer:**
- Dårlig ånde
- Savlen
- Vanskeligheder ved at spise
- Løse tænder
- Rødt eller hævet tandkød
- Modvilje mod at blive rørt ved hovedet

Vi anbefaler regelmæssig tandkontrol som en del af den årlige sundhedsundersøgelse.', 'Smile', 'klinisk', 10, 'service-tandbehandling'),

  ('konsultation', 'Konsultation', 'En konsultation er det første skridt når dit dyr er sygt eller har brug for sundhedsrådgivning.

**En konsultation omfatter:**
- Grundig klinisk undersøgelse
- Gennemgang af sygehistorie
- Diskussion af symptomer og observationer
- Eventuel diagnostik (blodprøver, røntgen, ultralyd)
- Diagnose og behandlingsplan
- Udlevering af medicin ved behov

**Vi anbefaler konsultation ved:**
- Ændringer i appetit eller vægt
- Ændringer i adfærd
- Opkastning eller diarré
- Hoste eller vejrtrækningsproblemer
- Halhed eller bevægelsesproblemer
- Hudproblemer eller kløe
- Alle andre bekymringer om dit dyrs helbred

Ved akutte problemer bedes du ringe i forvejen, så vi kan forberede os på din ankomst.', 'ClipboardList', 'klinisk', 11, 'service-konsultation'),

  ('sygeplejerske-konsultation', 'Sygeplejerskekonsultationer', 'Vores erfarne veterinærsygeplejersker tilbyder en række konsultationer og behandlinger.

**Sygeplejerskekonsultationer omfatter:**
- Vægtjustering og kostvejledning
- Sårbandagering og skiftning
- Fjernelse af sting
- Vaccination (efter dyrlægens anvisning)
- Øreskylning
- Kloklipning
- Anlpleje

**Fordele ved sygeplejerskekonsultation:**
- Kortere ventetid
- Lavere pris end dyrlægekonsultation
- Specialiseret viden om pleje og ernæring
- Tid til grundig vejledning

Sygeplejerskekonsultationer er ideelle til opfølgning, rutineprocedurer og sundhedsrådgivning. Ved sygdom eller nye symptomer anbefaler vi altid en dyrlægekonsultation først.', 'UserPlus', 'klinisk', 12, 'service-sygeplejerske-konsultation'),

  ('ultralydsscanning', 'Ultralydsscanning', 'Ultralyd er en sikker og smertefri måde at undersøge dit dyrs indre organer på.

**Vi bruger ultralyd til:**
- Undersøgelse af bughulen (lever, nyrer, milt, blære, tarme)
- Drægtigheds-scanning
- Hjertescanning (ekkokardiografi)
- Vejledning ved prøvetagning

**Fordele ved ultralyd:**
- Ingen stråling
- Smertefrit
- Kan ofte udføres uden bedøvelse
- Giver realtidsbilleder af organerne

**Praktisk information:**
- Pelsen klippes ofte på skanningsområdet
- Det kan være en fordel at faste inden scanning af bughulen
- Undersøgelsen tager typisk 15-30 minutter
- Du får svar med det samme

Vi har moderne ultralydsudstyr der giver detaljerede billeder af dit dyrs organer.', 'Scan', 'diagnostik', 13, 'service-ultralydsscanning'),

  ('roentgen', 'Røntgen', 'Røntgen er et vigtigt diagnostisk værktøj til at undersøge knogler, led og indre organer.

**Røntgen bruges til:**
- Knoglebrud og ledproblemer
- Undersøgelse af lunger og hjerte
- Mavepatienter (fremmedlegemer, forstoppelse)
- Drægtigheds-tælling
- Tand- og kæbeproblemer

**Praktisk information:**
- Undersøgelsen er hurtig og smertefri
- Let bedøvelse kan være nødvendig for at holde dyret stille
- Resultater kan vurderes med det samme
- Billeder kan sendes til specialister ved behov

Moderne digital røntgenteknik giver os høj billedkvalitet med minimal stråledosis til dit dyr.', 'FileImage', 'diagnostik', 14, 'service-roentgen'),

  ('blodproever', 'Blodprøver og laboratorium', 'Blodprøver giver vigtig information om dit dyrs sundhedstilstand og er essentielle for diagnose af mange sygdomme.

**Vi kan måle:**
- Blodtal (røde og hvide blodlegemer)
- Lever- og nyreværdier
- Elektrolytter
- Blodsukker
- Skjoldbruskkirtelfunktion
- Bugspytkirtelfunktion

**Andre laboratorieundersøgelser:**
- Urinanalyse
- Afføringsprøver for parasitter
- Celleprøver fra knuder
- Bakteriologi og resistensbestemmelse

**Fordele ved blodprøver:**
- Hurtige resultater (ofte samme dag)
- Tidlig opdagelse af sygdom
- Vigtig før bedøvelse og operation
- Monitorering af kroniske sygdomme

Vi anbefaler årlige blodprøver til ældre dyr som en del af forebyggende sundhedspleje.', 'FlaskConical', 'diagnostik', 15, 'service-blodproever'),

  ('kaniner', 'Kaniner og smådyr', 'Vi har særlig ekspertise i behandling af kaniner og andre smådyr.

**Vi behandler:**
- Kaniner
- Marsvin
- Hamstere
- Rotter og mus
- Fritter
- Chinchillaer

**Typiske konsultationsårsager:**
- Vaccinationer (kaniner)
- Tandproblemer (meget almindeligt hos kaniner og gnavere)
- Mave-tarm problemer
- Hudproblemer og parasitter
- Luftvejsinfektioner
- Neutralisation

**Specielle hensyn:**
- Smådyr kræver særlig håndtering og tilgang
- Anæstesi tilpasses det enkelte dyrs størrelse
- Kostvejledning er ofte en vigtig del af behandlingen

Vores personale er trænet i skånsom håndtering af små og nervøse patienter.', 'Rabbit', 'special', 16, 'service-kaniner'),

  ('fysiurgi', 'Fysiurgisk hundeterapi', 'Vi tilbyder fysiurgisk behandling til hunde med bevægelsesproblemer eller som rehabilitering efter operation.

**Behandlingsmetoder:**
- Massage og manuel terapi
- Strækøvelser
- Genoptræningsøvelser
- Laserterapi
- Vandterapi (hydrotherapy)

**Hvem kan have gavn af fysioterapi?**
- Hunde efter ortopædiske operationer
- Ældre hunde med slidgigt
- Hunde med rygproblemer
- Sportshunde og arbejdshunde
- Overvægtige hunde under vægttab

**Behandlingsforløb:**
- Starter med en grundig undersøgelse
- Individuel behandlingsplan udarbejdes
- Typisk forløb med ugentlige behandlinger
- Hjemmeøvelser instrueres

Fysioterapi kan betydeligt forbedre livskvaliteten for hunde med kroniske smerter eller bevægelsesproblemer.', 'Dumbbell', 'special', 17, 'service-fysiurgi'),

  ('haandkoeb', 'Foder & håndkøbsprodukter', 'Ud over konsultationer og behandlinger fører vi et udvalg af produkter til dit dyrs sundhed og velvære.

**Foder:**
- Kvalitetsfoder fra førende mærker
- Diætfoder til specielle behov
- Godbidder og snacks

**Parasitforebyggelse:**
- Loppe- og flåtmidler
- Ormekure
- Øredråber

**Plejeprodukter:**
- Øjendråber og øjenrens
- Ørerens
- Shampoo og pelspleje
- Tandbørster og tandpasta til dyr
- Poterens

**Tilskud:**
- Vitaminer
- Ledsundhed (glucosamin)
- Probiotika
- Omega-fedtsyrer

Vores personale kan rådgive om de rette produkter til netop dit dyr.', 'Package', 'special', 18, 'service-haandkoeb'),

  ('fear-free', 'Fear Free', 'Vi arbejder med Fear Free principper for at gøre dyrlægebesøget til en positiv oplevelse for dit dyr.

**Hvad er Fear Free?**
Fear Free er en international certificering der fokuserer på at reducere frygt, angst og stress hos dyr under dyrlægebesøg.

**Sådan arbejder vi:**
- Rolig og stressfri atmosfære i venteværelset
- Separate venteområder for hunde og katte
- Brug af feromoner (Adaptil og Feliway)
- Skånsom håndtering tilpasset det enkelte dyr
- Godbidder og positive associationer
- Medicinsk angstreduktion når nødvendigt

**Fordele for dit dyr:**
- Mindre stress under besøget
- Bedre samarbejde under undersøgelse
- Mere pålidelige undersøgelsesresultater
- Positive oplevelser der gør fremtidige besøg lettere

Vi anbefaler at du kontakter os før besøget, hvis dit dyr er særligt angst eller nervøst.', 'Heart', 'special', 19, 'service-fear-free')
ON CONFLICT (slug) DO NOTHING;
