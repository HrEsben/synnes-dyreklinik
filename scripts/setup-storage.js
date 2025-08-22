const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const envVars = {}
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, value] = line.split('=')
    if (key && value) {
      envVars[key.trim()] = value.trim()
    }
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  try {
    console.log('Checking if clinic-images bucket exists...')
    
    // List all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return
    }
    
    console.log('Existing buckets:', buckets.map(b => b.name))
    
    // Check if clinic-images bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === 'clinic-images')
    
    if (bucketExists) {
      console.log('✅ clinic-images bucket already exists')
    } else {
      console.log('Creating clinic-images bucket...')
      
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket('clinic-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      })
      
      if (error) {
        console.error('Error creating bucket:', error)
        return
      }
      
      console.log('✅ clinic-images bucket created successfully')
    }
    
    // Test upload to verify bucket is working
    console.log('Testing bucket access...')
    const testFile = Buffer.from('test')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('clinic-images')
      .upload('test.txt', testFile)
    
    if (uploadError) {
      console.error('Error testing upload:', uploadError)
    } else {
      console.log('✅ Bucket is accessible')
      
      // Clean up test file
      await supabase.storage.from('clinic-images').remove(['test.txt'])
    }
    
  } catch (error) {
    console.error('Setup failed:', error)
  }
}

setupStorage()
