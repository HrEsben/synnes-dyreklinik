import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen pt-20 bg-[#fffaf6]">
      <section className="relative px-4 md:px-6 overflow-hidden">
        <div className="mx-auto max-w-[1257px]">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mb-8"></div>
          </div>
        </div>
      </section>

      <section className="py-6 px-4 md:px-6">
        <div className="mx-auto max-w-[1257px]">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#7d1e82] animate-spin mx-auto mb-4" />
              <p className="text-[#817d7d]">Indlæser dashboard...</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
