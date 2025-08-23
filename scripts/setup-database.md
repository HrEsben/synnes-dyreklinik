# Database Setup Instructions

Du har nu to nye funktioner der kræver database migrations:

## 1. FAQ Management 
For at aktivere FAQ funktionaliteten, kør SQL'en i `scripts/create_faq_table.sql`

## 2. Editable Images (NYFEST!)
For at aktivere billedskiftefunktionen, kør SQL'en i `scripts/create_site_images_table.sql`

## Steps:

1. Go til din Supabase dashboard
2. Naviger til "SQL Editor"
3. Kopier og indsæt indholdet fra **begge** SQL filer:
   - `scripts/create_faq_table.sql`
   - `scripts/create_site_images_table.sql`
4. Kør begge SQL scripts

## Efter migrations:

### FAQ Management:
- ✅ Persistent storage i database
- ✅ Create, edit, delete FAQs  
- ✅ Reorder FAQs
- ✅ Authentication protection

### Editable Images:
- ✅ **Klik på billeder når du er logget ind for at skifte dem!**
- ✅ Drag & drop upload
- ✅ HEIC konvertering
- ✅ Automatic image optimization
- ✅ Database persistent storage
- ✅ Real-time updates

## Hvordan det virker:

**Billeder der kan skiftes:**
- Hero billede med Synne og hund (forside)
- Synne portræt (forside)
- Kat billede (Om side)
- Hund billede (Om side)

**Sådan gør du:**
1. Log ind på din hjemmeside
2. Hover over et billede
3. Klik "Skift billede" knappen
4. Upload et nyt billede
5. Se ændringen med det samme!

**Billeder som IKKE kan skiftes:**
- Logo (navigation) - dette styres via `editable={false}` prop
- Team member billeder (styres via admin panel)

Du kan tilføje flere editable billeder ved at bruge `<EditableImage>` komponenten med `editable={true}` prop.
