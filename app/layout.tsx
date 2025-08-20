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
