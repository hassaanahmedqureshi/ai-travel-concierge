import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Travel Concierge",
  description: "Describe your trip, get a personalized day-by-day itinerary",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className="h-screen overflow-hidden font-[family-name:var(--font-nunito-sans)]">
        {children}
      </body>
    </html>
  );
}
