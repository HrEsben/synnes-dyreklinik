import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffaf6]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#7d1e82] animate-spin mx-auto mb-4" />
        <p 
          className="text-lg text-[#817d7d]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Indlæser...
        </p>
      </div>
    </div>
  )
}
