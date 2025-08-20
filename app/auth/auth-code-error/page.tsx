import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Godkendelsesfejl
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Der opstod en fejl under login. Prøv venligst igen.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tilbage til login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
