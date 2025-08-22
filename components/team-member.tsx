import Link from "next/link";
import Image from "next/image";

interface TeamMemberProps {
  name: string;
  position: string;
  imageUrl?: string;
  link?: string;
}

export default function TeamMember({ name, position, imageUrl, link }: TeamMemberProps) {
  const defaultImageUrl = "https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/billedepaavej.jpg";
  const displayImageUrl = imageUrl || defaultImageUrl;

  const TeamMemberContent = () => (
    <div className="bg-white text-center group rounded-2xl duration-300 border-1 hover:border-[#f97561] transition-all hover:text-[#f97561] overflow-hidden lg:max-w-[400px] hover:-translate-y-1 h-full flex flex-col">
      <div className="relative mb-10 overflow-hidden flex-shrink-0">
        <Image
          src={displayImageUrl}
          alt={name}
          width={400}
          height={500}
          className="w-full h-100 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="pb-16 px-4 flex-grow flex flex-col justify-center">
      <h3 className="text-2xl font-extrabold">
        {name}
      </h3>
      <p className="text-[#817d7d] text-[18px] font-medium">
        {position}
      </p>
      </div>
    </div>
  );

  // If a link is provided, wrap the content in a Link component
  if (link) {
    return (
      <Link href={link} className="block">
        <TeamMemberContent />
      </Link>
    );
  }

  // Otherwise, return the content directly
  return <TeamMemberContent />;
}
