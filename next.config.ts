import type { NextConfig } from "next";

// Get Supabase hostname from URL for dynamic configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sethupsgoqfwrdepecld.supabase.co';
const supabaseHostname = new URL(supabaseUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // Security headers for production
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            // Content Security Policy - adjust as needed
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.instagram.com https://platform.instagram.com https://*.cdninstagram.com https://vercel.live https://*.vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' https://fonts.gstatic.com",
              `connect-src 'self' https://${supabaseHostname} wss://${supabaseHostname} https://maps.googleapis.com https://www.google.com https://www.instagram.com https://platform.instagram.com https://*.cdninstagram.com https://vercel.live https://*.vercel.live wss://vercel.live wss://*.vercel.live`,
              "frame-src 'self' https://www.google.com https://www.instagram.com https://platform.instagram.com https://onlinebooking.planday.com https://www.vettigo.dk https://vettigo.dk https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://vercel.live https://*.vercel.live",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; ')
          }
        ],
      },
    ];
  },
};

export default nextConfig;
