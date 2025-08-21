import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Synnes Dyreklinik",
  description: "Erfaren dyrlæge med passion for familiens dyr og dyrenes familier",
  icons: {
    icon: [
      { url: '/favicon-transparent-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-transparent-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-transparent-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-transparent-180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
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
        className={`${poppins.variable} font-sans antialiased`}
      >
        <div className="mx-auto">
        <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
