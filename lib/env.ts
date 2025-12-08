import { z } from 'zod'

/**
 * Environment variable validation schema
 * This ensures all required environment variables are set before the app runs
 */
const envSchema = z.object({
  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),
  
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  
  // Google Places API (optional - will use mock data if not set)
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  
  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validated environment variables
 * Will throw an error at build/startup time if required variables are missing
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables. Check your .env.local file.')
  }

  return parsed.data
}

// Export validated env - this will run validation on import
export const env = validateEnv()

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === 'production'

// Helper to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development'
