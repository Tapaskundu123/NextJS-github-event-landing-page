import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "../components/LightRays";
import Navbar from "@/components/Navbar";

const SchibstedGrotesk = Schibsted_Grotesk({ variable: "--font-schibsted-grotesk", subsets: ["latin"] });
const MartianMono = Martian_Mono({ variable: "--font-martian-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Every Dev Event you mustn't miss",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${SchibstedGrotesk.variable} ${MartianMono.variable} antialiased`}>
        <Navbar/>
        <div className="relative overflow-hidden"> {/* Added overflow-hidden to clip the LightRays */}
          <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
            <LightRays raysOrigin="top-center-offset" raysColor="#5dfeca" raysSpeed={0.5} />
          </div>
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}