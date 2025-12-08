import type { Metadata } from 'next'
import BookingFrame from '@/components/booking-frame'

export const metadata: Metadata = {
  title: 'Book tid - Synnes Dyreklinik',
  description: 'Book en tid hos Synnes Dyreklinik online. Vi står klar til at hjælpe dig og dit kæledyr.',
}

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Book an Appointment</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <BookingFrame
            src="https://www.vettigo.dk/booking.php?_klinik=syn999"
            title="Synne's Dyreklinik Booking System"
            height="800px"
            className="w-full"
          />
        </div>
        
        <div className="mt-8 text-center text-gray-600">
          <p>Having trouble with the booking system?</p>
          <p>Contact us directly at <a href="tel:49400599" className="text-blue-600 hover:underline">49 40 05 99</a></p>
          <p>or email <a href="mailto:synne@synnesdyreklinik.dk" className="text-blue-600 hover:underline">synne@synnesdyreklinik.dk</a></p>
        </div>
      </div>
    </div>
  )
}
