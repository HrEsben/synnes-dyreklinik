import { createClient } from '@/lib/supabase/server'
import Divider from '@/components/divider'
import PriceAnchorNav from '@/components/price-anchor-nav'
import EditableText from '@/components/editable-text'

export const metadata = {
  title: "Priser - Synnes Dyreklinik",
  description: "Se vores priser for veterinære behandlinger og ydelser. Vi tilbyder gennemsigtige priser for konsultationer, operationer, vaccinationer og meget mere.",
};

interface PriceCategory {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface PriceItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price_from: number | null
  price_to: number | null
  price_note: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

function formatPrice(priceFrom: number | null, priceTo: number | null, priceNote: string | null): string {
  if (priceNote) {
    return priceNote
  }
  
  if (priceFrom && priceTo && priceFrom !== priceTo) {
    return `${priceFrom.toLocaleString('da-DK')} - ${priceTo.toLocaleString('da-DK')} kr.`
  }
  
  if (priceFrom) {
    return `${priceFrom.toLocaleString('da-DK')} kr.`
  }
  
  return 'Kontakt os for pris'
}

export default async function PriserPage() {
  const supabase = await createClient()

  // Fetch categories with their price items
  const { data: categories, error: categoriesError } = await supabase
    .from('price_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const { data: priceItems, error: priceItemsError } = await supabase
    .from('price_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (categoriesError || priceItemsError) {
    console.error('Error fetching prices:', categoriesError || priceItemsError)
  }

  // Fetch site content for editable text
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content_key, content')
    .in('content_key', [
      'prices_page_title',
      'prices_page_subtitle',
      'prices_info_title',
      'prices_info_paragraph_1',
      'prices_info_paragraph_2',
      'prices_info_paragraph_3',
      'prices_cta_title',
      'prices_cta_subtitle'
    ])

  // Create a content map for easy lookup
  const contentMap = (siteContent || []).reduce((acc, item) => {
    acc[item.content_key] = item.content
    return acc
  }, {} as Record<string, string>)

  // Helper function to get content with fallback
  const getContent = (key: string, fallback: string) => contentMap[key] || fallback

  // Group price items by category
  const categoriesWithItems = (categories || []).map((category: PriceCategory) => ({
    ...category,
    items: (priceItems || []).filter((item: PriceItem) => item.category_id === category.id)
  }))

  // Create anchor links for navigation
  const anchorLinks = categoriesWithItems.map((category) => ({
    id: category.slug,
    label: category.name,
    href: `#${category.slug}`
  }))

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero-section" className="relative pb-12 pt-20 px-4 md:px-6 bg-[#fffaf6] overflow-hidden">
        <div className="mx-auto max-w-[1257px]">
          <div className="text-center">
            <EditableText
              contentKey="prices_page_title"
              defaultValue={getContent('prices_page_title', 'Prisliste')}
              tag="h1"
              className="mb-6"
              style={{ 
                fontWeight: 800, 
                fontFamily: '"Poppins ExtraBold", Poppins, sans-serif', 
                fontSize: 'clamp(32px, 5vw, 49px)', 
                lineHeight: '1.51em', 
                color: 'rgb(44, 37, 36)' 
              }}
            />
            <EditableText
              contentKey="prices_page_subtitle"
              defaultValue={getContent('prices_page_subtitle', 'Her finder du vores priser for de mest almindelige behandlinger og ydelser. Alle priser inkluderer miljøtillæg hvor relevant. Kontakt os gerne for en præcis prisopgørelse for netop din situation.')}
              tag="p"
              className="mb-8 text-xl lg:text-lg font-medium text-muted-foreground max-w-3xl mx-auto leading-[1.9]"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Sticky Anchor Navigation */}
      {anchorLinks.length > 0 && (
        <PriceAnchorNav categories={anchorLinks} />
      )}

      {/* Price Lists by Category */}
      <section className="py-16 px-4 md:px-6">
        <div className="mx-auto max-w-[1257px] space-y-16">
          {categoriesWithItems.map((category) => (
            <div key={category.id} id={category.slug} className="scroll-mt-40">
              {/* Category Header */}
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#2c2524] mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-lg text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Price Table - Desktop */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#fffaf6]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#2c2524] w-1/2">
                        Ydelse
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[#2c2524] w-1/2">
                        Pris
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {category.items.map((item: PriceItem, index: number) => (
                      <tr 
                        key={item.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#2c2524]">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-[#2c2524]">
                          {formatPrice(item.price_from, item.price_to, item.price_note)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Cards - Mobile */}
              <div className="md:hidden space-y-3">
                {category.items.map((item: PriceItem) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2c2524] mb-1">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-[#2c2524] whitespace-nowrap">
                          {formatPrice(item.price_from, item.price_to, item.price_note)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Additional Information */}
      <section className="py-16 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <EditableText
              contentKey="prices_info_title"
              defaultValue={getContent('prices_info_title', 'Vigtig information om priser')}
              tag="h2"
              className="text-2xl lg:text-3xl font-bold text-[#2c2524] mb-6"
            />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <EditableText
                contentKey="prices_info_paragraph_1"
                defaultValue={getContent('prices_info_paragraph_1', 'Priserne på denne side er vejledende og kan variere afhængigt af behandlingens kompleksitet og dit dyrs specifikke behov.')}
                tag="p"
                multiline
              />
              <EditableText
                contentKey="prices_info_paragraph_2"
                defaultValue={getContent('prices_info_paragraph_2', 'Vi anbefaler altid, at du kontakter os for en præcis prisopgørelse inden behandling. Vi laver gerne et skriftligt prisoverslag, så du ved, hvad du kan forvente.')}
                tag="p"
                multiline
              />
              <EditableText
                contentKey="prices_info_paragraph_3"
                defaultValue={getContent('prices_info_paragraph_3', 'Kontakt os på telefon 49 40 05 99 eller mail info@synnesdyreklinik.dk for yderligere information.')}
                tag="p"
                className="font-semibold text-[#2c2524]"
                multiline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-6">
        <div className="mx-auto max-w-[1257px] text-center">
          <EditableText
            contentKey="prices_cta_title"
            defaultValue={getContent('prices_cta_title', 'Har du spørgsmål til priser?')}
            tag="h2"
            className="mb-6 text-3xl lg:text-4xl font-bold text-accent-foreground"
          />
          <EditableText
            contentKey="prices_cta_subtitle"
            defaultValue={getContent('prices_cta_subtitle', 'Vi står altid klar til at give dig et uforpligtende prisoverslag på de behandlinger, dit kæledyr har brug for.')}
            tag="p"
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            multiline
          />
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
