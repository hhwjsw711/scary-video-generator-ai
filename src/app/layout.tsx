import "@/styles/globals.css";

import { type Metadata } from "next";

import type { ReactNode } from "react";

import { Providers } from "../components/providers/global-providers";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { Header } from "../components/header/header";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Amatic_SC,
  Special_Elite,
  Jolly_Lodger,
  Nosifer,
} from "next/font/google";
export const amatic = Amatic_SC({
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  subsets: ["vietnamese"],
  variable: "--font-amatic",
});
export const special = Special_Elite({
  weight: ["400"],
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-special",
});
export const jolly = Jolly_Lodger({
  weight: ["400"],
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-jolly",
});
export const nosifer = Nosifer({
  weight: ["400"],
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-nosifer",
});

export const metadata: Metadata = {
  title: "Wordream - AI Video Platform",
  icons: [
    { rel: "icon", type: "image/svg+xml", sizes: "48x48", url: "/favicon.svg" },
  ],
  keywords: [
    "AI video generator",
    "video production",
    "AI film maker",
    "script to video",
    "AI movie",
  ],
  description:
    "Describe an idea or paste a script, and it builds scenes, casts characters, generates shots, and scores music — all from one interface. Multi-scene, fully exportable.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          amatic.variable,
          jolly.variable,
          nosifer.variable,
          special.variable,
        )}
      >
        <Providers>
          <NextTopLoader />
          <TooltipProvider>
            <div className="flex h-screen w-screen flex-col overflow-hidden">
              <Header />
              <div className="h-full w-full flex-1 overflow-auto">
                <main className="min-h-[calc(100vh-100px)]">{children}</main>
                <Footer />
              </div>
            </div>
          </TooltipProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
