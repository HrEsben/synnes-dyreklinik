import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sanitizeHtml } from "@/lib/sanitize";

interface TeamMemberPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Fetch the employee by short_link
  const { data: employee, error } = await supabase
    .from('employees')
    .select('*')
    .eq('short_link', slug)
    .single();

  if (error || !employee) {
    notFound();
  }

  // Use bio as HTML content, with fallback for legacy JSON format
  let bioContent: string = '';
  if (employee.bio) {
    try {
      // Check if it's JSON (legacy format) - convert to HTML
      const jsonArray = JSON.parse(employee.bio);
      if (Array.isArray(jsonArray)) {
        bioContent = jsonArray.map(paragraph => `<p>${paragraph}</p>`).join('');
      } else {
        bioContent = employee.bio; // Already HTML
      }
    } catch {
      // Not JSON - treat as plain text and convert line breaks to HTML
      if (employee.bio.includes('<') && employee.bio.includes('>')) {
        bioContent = employee.bio; // Already HTML
      } else {
        // Plain text - convert line breaks to HTML
        bioContent = employee.bio
          .split('\n\n') // Split on double line breaks for paragraphs
          .filter((p: string) => p.trim().length > 0)
          .map((p: string) => {
            // Convert single line breaks within paragraphs to <br> tags
            const withBreaks = p.trim().replace(/\n/g, '<br>');
            return `<p>${withBreaks}</p>`;
          })
          .join('');
      }
    }
  }

  const defaultImageUrl = "https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/billedepaavej.jpg";
  const displayImageUrl = employee.img_url || defaultImageUrl;

  return (
    <div className="min-h-screen bg-[#fffaf6]">
      {/* Main Content Section */}
      <section className="pt-12 lg:pt-16 pb-8 lg:pb-12 px-4 md:px-6">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Back to Om button */}
              <Link
                href="/om"
                className="inline-flex items-center text-[#817d7d] hover:text-[#f97561] transition-colors mb-4"
              >
                ← Tilbage til teamet
              </Link>

              <h1 className="mb-2" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                lineHeight: '1.3em',
                color: '#2c2524'
              }}>
                {employee.name}
              </h1>
              <p className="text-lg mb-8 font-medium" style={{
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: '18px',
                color: '#f97561'
              }}>
                {employee.position}
              </p>

              <h2 className="mb-6" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                lineHeight: '1.4em',
                color: '#2c2524'
              }}>
                Om mig
              </h2>
              
              <div className="space-y-4 text-base leading-relaxed text-gray-600">
              {bioContent ? (
                <div 
                  className="prose prose-gray max-w-none [&>p]:mb-4 [&>p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(bioContent) }}
                  style={{
                    lineHeight: '1.6'
                  }}
                />
              ) : (
                <p className="text-gray-500 italic">
                  Ingen biografiinformation tilgængelig.
                </p>
              )}
            </div>
            </div>

            {/* Sidebar with Profile Image and Facts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Image */}
              <div className="relative max-w-xs mx-auto lg:mx-0">
                <Image
                  src={displayImageUrl}
                  alt={employee.name || 'Team member'}
                  width={300}
                  height={450}
                  className="w-full aspect-[2/3] object-cover rounded-2xl shadow-lg"
                  style={{ objectPosition: 'center top' }}
                />
              </div>

              {/* Facts Box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0e8e0]">
                <h3 className="mb-4" style={{ 
                  fontWeight: 700, 
                  fontFamily: 'Poppins Bold, Poppins, sans-serif',
                  fontSize: '18px',
                  lineHeight: '1.4em',
                  color: '#2c2524'
                }}>
                  Fakta
                </h3>
                
                <div className="space-y-3">
                  {employee.education && (
                    <div>
                      <p className="text-sm font-medium text-[#f97561] mb-1">Uddannelse</p>
                      <p className="text-sm text-gray-600">{employee.education}</p>
                    </div>
                  )}
                  
                  {employee.location && (
                    <div>
                      <p className="text-sm font-medium text-[#f97561] mb-1">Bor i</p>
                      <p className="text-sm text-gray-600">{employee.location}</p>
                    </div>
                  )}
                  
                  {employee.hobby && (
                    <div>
                      <p className="text-sm font-medium text-[#f97561] mb-1">Fritid</p>
                      <p className="text-sm text-gray-600">{employee.hobby}</p>
                    </div>
                  )}
                  
                  {employee.specialties && (
                    <div>
                      <p className="text-sm font-medium text-[#f97561] mb-1">Specialer</p>
                      <p className="text-sm text-gray-600">{employee.specialties}</p>
                    </div>
                  )}
                  
                  {employee.years_experience && (
                    <div>
                      <p className="text-sm font-medium text-[#f97561] mb-1">Uddannet</p>
                      <p className="text-sm text-gray-600">
                        {employee.years_experience} ({new Date().getFullYear() - parseInt(employee.years_experience)} års erfaring)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Generate static params by fetching from database
export async function generateStaticParams() {
  try {
    // Use a direct Supabase client for build time without cookies
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: employees } = await supabase
      .from('employees')
      .select('short_link')
      .not('short_link', 'is', null);

    return employees?.map((employee) => ({
      slug: employee.short_link,
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array as fallback
    return [];
  }
}
