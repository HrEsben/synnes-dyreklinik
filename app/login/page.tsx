import AuthForm from '@/components/auth/auth-form'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/logo.svg"
              alt="Synnes Dyreklinik"
              width={200}
              height={80}
              className="h-12 w-auto"
            />
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Log ind for at få adgang til dine veterinærtjenester
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
