'use client';

import Image from 'next/image';
import { Instagram } from 'lucide-react';

interface PolaroidInstagramPost {
  id: string;
  url: string;
  image: string;
  caption: string;
}

// Your actual Instagram posts with captions
const POLAROID_POSTS: PolaroidInstagramPost[] = [
  {
    id: 'DNxVdvtWs_-',
    url: 'https://www.instagram.com/synnesdyreklinik/p/DNxVdvtWs_-/',
    image: 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/1.png',
    caption: '🐾📞 Så er vi i gang igen!'
  },
  {
    id: 'DNpmyK-N8_3',
    url: 'https://www.instagram.com/synnesdyreklinik/p/DNpmyK-N8_3/',
    image: 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/2.png',
    caption: 'Klinikken oplever i øjeblikket telefonproblemer'
  },
  {
    id: 'DNkpxxdgP0I',
    url: 'https://www.instagram.com/synnesdyreklinik/p/DNkpxxdgP0I/',
    image: 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/3.png',
    caption: '🔬 Vi ser mere end det blotte øje kan! 🐾💡'
  },
  {
    id: 'DNfnHPNocoQ',
    url: 'https://www.instagram.com/synnesdyreklinik/p/DNfnHPNocoQ/',
    image: 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/4.png',
    caption: '🏆 Katten: 1🐱 – Musen: 0🐭'
  },
  {
    id: 'DNVayE1V7do',
    url: 'https://www.instagram.com/synnesdyreklinik/p/DNVayE1V7do/',
    image: 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/5.png',
    caption: '🌾👂 To genstridige græs-agnere – men Kima tog det i stiv pote! �'
  },
  {
    id: 'DNQMT00KDss',
    url: 'https://www.instagram.com/synnesdyreklinik/p/DNQMT00KDss/',
    image: 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/6.png',
    caption: '☀️🐾 Hot dog? Nej tak! �'
  }
];

// Predefined rotations for each polaroid to make them look naturally scattered
const POLAROID_ROTATIONS = [
  'rotate-[-8deg]',
  'rotate-[4deg]',
  'rotate-[-12deg]',
  'rotate-[7deg]',
  'rotate-[-5deg]',
  'rotate-[9deg]'
];

// Z-index classes for layering effect - keeping below navigation (z-50)
const Z_INDEXES = [
  'z-10',
  'z-20',
  'z-30',
  'z-[35]',
  'z-[38]',
  'z-[42]'
];

// Mobile offset classes for staggered vertical layout
const MOBILE_OFFSETS = [
  'translate-x-[-40px]', // First image: more to the left
  'translate-x-[40px]',  // Second image: more to the right
  'translate-x-[-35px]', // Third image: left (strong)
  'translate-x-[35px]',  // Fourth image: right (strong)
  'translate-x-[-30px]', // Fifth image: left (medium)
  'translate-x-[30px]'   // Sixth image: right (medium)
];

interface InstagramPolaroidFeedProps {
  limit?: number;
  className?: string;
}

// Helper function to truncate long captions
const truncateCaption = (caption: string, maxLength: number = 50) => {
  if (caption.length <= maxLength) return caption;
  return caption.substring(0, maxLength).trim() + '...';
};

export default function InstagramPolaroidFeed({ 
  limit = 6,
  className = "" 
}: InstagramPolaroidFeedProps) {
  const posts = POLAROID_POSTS.slice(0, limit);

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: Vertical staggered layout */}
      <div className="md:hidden flex flex-col items-center space-y-[-30px] py-8 pt-0">
        {posts.map((post, index) => (
          <div
            key={`mobile-${post.id}`}
            className={`
              relative flex-shrink-0 transition-all duration-500 hover:scale-110 hover:z-[45]
              ${POLAROID_ROTATIONS[index % POLAROID_ROTATIONS.length]}
              ${Z_INDEXES[(posts.length - 1 - index) % Z_INDEXES.length]}
              ${MOBILE_OFFSETS[index % MOBILE_OFFSETS.length]}
              hover:rotate-0 hover:translate-x-0
            `}

          >
            {/* Polaroid frame */}
            <div className="bg-white p-3 pb-16 rounded-lg shadow-sm transition-shadow duration-300">
              {/* Photo area */}
              <div className="relative w-48 h-48 rounded overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-90 text-gray-800 rounded-full p-2 hover:bg-[#ed6e21] hover:text-white [transition:color_.3s,transform_.3s,background-color_.3s] hover:[transform:translate3d(0,-4px,.01px)]"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
              
              {/* Polaroid caption area */}
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-sm text-gray-700 font-medium leading-tight">
                  {truncateCaption(post.caption, 45)}
                </p>
              </div>
            </div>
            
            {/* Tape effect */}
            <div className="absolute -top-2 left-8 w-16 h-6 bg-yellow-100 opacity-60 rounded-sm transform rotate-12"></div>
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal overlapping layout */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-center min-h-[320px] overflow-x-auto pb-8 pt-8">
          <div className="flex items-center space-x-[-40px] md:space-x-[-50px] px-8">
            {posts.map((post, index) => (
              <div
                key={`desktop-${post.id}`}
                className={`
                  relative flex-shrink-0 transition-all duration-500 hover:scale-110 hover:z-[45]
                  ${POLAROID_ROTATIONS[index % POLAROID_ROTATIONS.length]}
                  ${Z_INDEXES[index % Z_INDEXES.length]}
                  hover:rotate-0
                `}
            
              >
                {/* Polaroid frame */}
                <div className="bg-white p-3 pb-16 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                  {/* Photo area */}
                  <div className="relative w-48 h-48 rounded overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.caption}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white bg-opacity-90 text-gray-800 rounded-full p-2 hover:bg-[#ed6e21] hover:text-white [transition:color_.3s,transform_.3s,background-color_.3s] hover:[transform:translate3d(0,-4px,.01px)]"
                      >
                        <Instagram size={20} />
                      </a>
                    </div>
                  </div>
                  
                  {/* Polaroid caption area */}
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-sm text-gray-700 font-medium leading-tight">
                      {truncateCaption(post.caption, 45)}
                    </p>
                  </div>
                </div>
                
                {/* Tape effect */}
                <div className="absolute -top-2 left-8 w-16 h-6 bg-yellow-100 opacity-60 rounded-sm transform rotate-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
