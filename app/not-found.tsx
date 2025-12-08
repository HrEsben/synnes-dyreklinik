import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#fffaf6]">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-[#7d1e82]/10 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-[#7d1e82]" />
          </div>
          <h1 
            className="text-6xl font-extrabold text-[#7d1e82] mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            404
          </h1>
          <h2 
            className="text-2xl font-bold text-[#2c2524] mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Siden blev ikke fundet
          </h2>
          <p className="text-[#817d7d] mb-6">
            Vi kunne desværre ikke finde den side, du leder efter.
          </p>
        </div>
        
        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="w-4 h-4" />
            Gå til forsiden
          </Button>
        </Link>
      </div>
    </div>
  )
}
