'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

interface PolaroidInstagramPost {
  id: string;
  url: string;
  image_url: string;
  caption: string;
}

interface InstagramPostFromAPI {
  id: string;
  url: string;
  image_url: string;
  caption: string;
  display_order: number;
  is_active: boolean;
}

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
  const [posts, setPosts] = useState<PolaroidInstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/instagram');
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }
        const data = await response.json();
        
        // Map API response to component format
        const mappedPosts = (data.posts || []).map((post: InstagramPostFromAPI) => ({
          id: post.id,
          url: post.url,
          image_url: post.image_url || `https://www.instagram.com/p/${post.id}/media/?size=m`,
          caption: post.caption || ''
        }));
        
        setPosts(mappedPosts.slice(0, limit));
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: Vertical staggered layout */}
      <div className="md:hidden flex flex-col items-center space-y-[-30px] py-8 pt-0">
        {posts.map((post, index) => (
          <a
            key={`mobile-${post.id}`}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
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
              <div className="relative w-48 h-48 rounded overflow-hidden bg-gray-100">
                <Image
                  src={post.image_url}
                  alt={post.caption || 'Instagram post'}
                  fill
                  className="object-cover"
                  sizes="192px"
                  unoptimized
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 text-gray-800 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity hover:bg-[#ed6e21] hover:text-white">
                    <Instagram size={20} />
                  </div>
                </div>
              </div>
              
              {/* Polaroid caption area */}
              {post.caption && (
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <p className="text-sm text-gray-700 font-medium leading-tight">
                    {truncateCaption(post.caption, 45)}
                  </p>
                </div>
              )}
            </div>
            
            {/* Tape effect */}
            <div className="absolute -top-2 left-8 w-16 h-6 bg-yellow-100 opacity-60 rounded-sm transform rotate-12"></div>
          </a>
        ))}
      </div>

      {/* Desktop: Horizontal overlapping layout */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-center min-h-[320px] overflow-x-auto pb-8 pt-8">
          <div className="flex items-center space-x-[-40px] md:space-x-[-50px] px-8">
            {posts.map((post, index) => (
              <a
                key={`desktop-${post.id}`}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
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
                  <div className="relative w-48 h-48 rounded overflow-hidden bg-gray-100">
                    <Image
                      src={post.image_url}
                      alt={post.caption || 'Instagram post'}
                      fill
                      className="object-cover"
                      sizes="192px"
                      unoptimized
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 text-gray-800 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity hover:bg-[#ed6e21] hover:text-white">
                        <Instagram size={20} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Polaroid caption area */}
                  {post.caption && (
                    <div className="absolute bottom-3 left-3 right-3 text-center">
                      <p className="text-sm text-gray-700 font-medium leading-tight">
                        {truncateCaption(post.caption, 45)}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Tape effect */}
                <div className="absolute -top-2 left-8 w-16 h-6 bg-yellow-100 opacity-60 rounded-sm transform rotate-12"></div>
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
