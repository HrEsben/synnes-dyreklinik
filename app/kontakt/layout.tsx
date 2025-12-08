import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt os - Synnes Dyreklinik',
  description: 'Kontakt Synnes Dyreklinik. Find vores adresse, telefonnummer og åbningstider. Vi står klar til at hjælpe dig og dit kæledyr.',
}

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
