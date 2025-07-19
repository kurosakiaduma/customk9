import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceProvider from "@/providers/ServiceProvider";

// Import Swiper CSS
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CustomK9 - Professional Dog Training",
  description: "Expert dog training services tailored to your needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServiceProvider>
          {children}
        </ServiceProvider>
      </body>
    </html>
  );
}
