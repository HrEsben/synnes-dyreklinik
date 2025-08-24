export default function Navigation() {
  return (
    <nav className="bg-white border-b">
      <div className="mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-lg font-bold">Synnes Dyreklinik</div>
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-900">Forside</a>
            <a href="/booking" className="text-gray-900">Book tid</a>
            <a href="/kontakt" className="text-gray-900">Kontakt</a>
          </div>
        </div>
      </div>
    </nav>
  )
}
