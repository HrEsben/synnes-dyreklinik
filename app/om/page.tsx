import Image from "next/image";
import Footer from "@/components/footer";
import TeamMember from "@/components/team-member";
import { createClient } from "@/lib/supabase/server";
import Divider from "@/components/divider";

export default async function OmPage() {
  const supabase = await createClient();
  
  // Fetch all employees from the database
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching employees:', error);
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pb-6 lg:pt-40 px-4 md:px-6 bg-[#fffaf6] overflow-hidden">
        <div className="mx-auto max-w-[1257px]">
          <div className="text-center">
            <h1 className="mb-6" style={{ 
              fontWeight: 800, 
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontSize: 'clamp(32px, 5vw, 49px)',
              lineHeight: '1.51em',
              color: '#2c2524'
            }}>
              Mød vores team
            </h1>
            <p className="text-lg mb-8 text-muted-foreground leading-[1.9] max-w-2xl mx-auto" style={{
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '18px',
              lineHeight: '1.89em',
              color: '#817d7d'
            }}>
              Vi er et dedikeret team med forkærlighed for dyr og tryghed.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="pb-16 lg:pb-24 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 items-stretch">
            {employees && employees.length > 0 ? (
              employees.map((employee) => (
                <TeamMember
                  key={employee.id}
                  name={employee.name || 'Unknown'}
                  position={employee.position || 'Position'}
                  imageUrl={employee.img_url || undefined}
                  link={employee.short_link ? `/om/${employee.short_link}` : undefined}
                />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                <p>Ingen medarbejdere fundet</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Divider className="" />
      {/* About Section */}
      <section className="py-16 lg:py-24 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                lineHeight: '1.51em',
                color: '#2c2524'
              }}>
                Klinikken
              </h2>
              <div className="space-y-6">
                <p className="text-lg leading-[1.9]" style={{
                  fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '1.89em',
                  color: '#817d7d'
                }}>
                 Siden jeg blev færdig dyrlæge, har jeg haft et ønske om at skabe min egen klinik. I årene 2015-2018 arbejdede jeg som vagtdyrlæge på konsulentbasis og fik snuset lidt til livet som selvstændig. Nu har jeg taget springet og er igen selvstændig dyrlæge. </p>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/katkigger.jpg"
                alt="Kat kigger"
                width={600}
                height={500}
                className="w-full h-96 object-cover rounded-4xl rotate-z-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Section */}
      <section className="py-16 lg:py-24 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Image
                src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/hundligger.jpg"
                alt="Synne working at the clinic"
                width={600}
                height={500}
                className="w-full h-96 object-cover rounded-4xl -rotate-z-3"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="mb-6" style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                lineHeight: '1.51em',
                color: '#2c2524'
              }}>
                Om os
              </h2>
              <div className="space-y-6">
                <p className="text-lg leading-[1.9]" style={{
                  fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '1.89em',
                  color: '#817d7d'
                }}>
                  Jeg ønsker at skabe en klinik, hvor der er tid og ro til at gennemføre undersøgelser og behandlinger uden unødig stress for dyret.

Hvor der er tid til grundig gennemgang af behandlingsplan og vejledning og hvor humor og latter går hånd i hånd med høj faglighed.
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
