import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-white border-b">
      <div className="mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-lg font-bold">Synnes Dyreklinik</div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900">Forside</Link>
            <Link href="/booking" className="text-gray-900">Book tid</Link>
            <Link href="/kontakt" className="text-gray-900">Kontakt</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
