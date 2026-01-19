import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AlertBanner from "@/components/alert-banner";
import DynamicSpacer from "@/components/dynamic-spacer";
import { AlertProvider } from "@/components/alert-context";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Synnes Dyreklinik",
    template: "%s | Synnes Dyreklinik"
  },
  description: "Erfaren dyrlæge med passion for familiens dyr og dyrenes familier. Personlig og professionel behandling af kæledyr i Nordsjælland.",
  keywords: ["dyrlæge", "dyreklinik", "veterinær", "kæledyr", "hund", "kat", "Nordsjælland", "Hillerød"],
  authors: [{ name: "Synnes Dyreklinik" }],
  creator: "Synnes Dyreklinik",
  metadataBase: new URL('https://synnesdyreklinik.dk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    url: 'https://synnesdyreklinik.dk',
    siteName: 'Synnes Dyreklinik',
    title: 'Synnes Dyreklinik',
    description: 'Fear Free dyreklinik med høj faglighed og personligt nærvær. Din lokale dyrlæge i Ejby, Kirke Hyllinge.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synnes Dyreklinik',
    description: 'Fear Free dyreklinik med høj faglighed og personligt nærvær. Din lokale dyrlæge i Ejby, Kirke Hyllinge.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-transparent-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-transparent-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-transparent-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-transparent-180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body
        className={`${poppins.variable} font-sans antialiased bg-[#fffaf6]`}
      >
        <AlertProvider>
          <div className="mx-auto">
            <Navigation />
            <AlertBanner />
            <DynamicSpacer />
            {children}
            <Footer />
          </div>
        </AlertProvider>
        <Analytics />
      </body>
    </html>
  );
}
