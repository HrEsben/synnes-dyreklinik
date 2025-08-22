import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { Facebook, Instagram, Linkedin } from "lucide-react";

interface Employee {
  id: number;
  name: string | null;
  position: string | null;
  img_url: string | null;
  short_link: string | null;
  bio: string | null;
}

interface TeamMemberPageProps {
  params: {
    slug: string;
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const supabase = await createClient();
  
  // Fetch the employee by short_link
  const { data: employee, error } = await supabase
    .from('employees')
    .select('*')
    .eq('short_link', params.slug)
    .single();

  if (error || !employee) {
    notFound();
  }

  // Parse bio as JSON array if it's stored as JSON, otherwise split by newlines
  let bioParagraphs: string[] = [];
  if (employee.bio) {
    try {
      // Try to parse as JSON first
      bioParagraphs = JSON.parse(employee.bio);
    } catch {
      // If not JSON, split by double newlines or use as single paragraph
      bioParagraphs = employee.bio.split('\n\n').filter((p: string) => p.trim().length > 0);
    }
  }

  const defaultImageUrl = "https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/billedepaavej.jpg";
  const displayImageUrl = employee.img_url || defaultImageUrl;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 md:px-6 bg-[#fffaf6] overflow-hidden curved-bottom">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="mb-4" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: 'clamp(32px, 5vw, 49px)',
                lineHeight: '1.51em',
                color: '#2c2524'
              }}>
                {employee.name}
              </h1>
              <p className="text-xl mb-8 font-medium" style={{
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: '20px',
                color: '#f97561'
              }}>
                {employee.position}
              </p>
              
              {/* Back to Om button */}
              <Link
                href="/om"
                className="inline-flex items-center text-[#817d7d] hover:text-[#f97561] transition-colors"
              >
                ← Tilbage til teamet
              </Link>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <Image
                  src={displayImageUrl}
                  alt={employee.name || 'Team member'}
                  width={500}
                  height={600}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-[1257px]">
          <div className="max-w-4xl">
            <h2 className="mb-8" style={{ 
              fontWeight: 800, 
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontSize: 'clamp(28px, 4vw, 42px)',
              lineHeight: '1.51em',
              color: '#2c2524'
            }}>
              Om mig
            </h2>
            
            <div className="space-y-6">
              {bioParagraphs.map((paragraph: string, index: number) => (
                <p 
                  key={index}
                  className="text-lg leading-[1.9]" 
                  style={{
                    fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '1.89em',
                    color: '#817d7d'
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
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
