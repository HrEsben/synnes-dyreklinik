import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log ind - Synnes Dyreklinik',
  description: 'Log ind for at administrere Synnes Dyreklinik hjemmeside.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
