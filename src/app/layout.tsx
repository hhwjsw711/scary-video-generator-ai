import "@/styles/globals.css";

import { type Metadata } from "next";

import type { ReactNode } from "react";
import { Suspense } from "react";

import { Providers } from "../components/providers/global-providers";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { Header } from "../components/header/header";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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
      <head>
        <link
          rel="preconnect"
          href="https://canny-hippopotamus-570.convex.site"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={cn("min-h-screen bg-background font-kecal antialiased")}>
        <Providers>
          <NextTopLoader />
          <TooltipProvider>
            <div className="flex h-screen w-screen flex-col overflow-hidden">
              <Suspense
                fallback={
                  <div className="animate-pulse border-b border-purple-700 py-2">
                    <div className="container mx-auto flex items-center justify-between">
                      <div className="h-8 w-28 rounded bg-purple-700/30" />
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-purple-700/30" />
                        <div className="h-10 w-10 rounded bg-purple-700/30 md:hidden" />
                      </div>
                    </div>
                  </div>
                }
              >
                <Header />
              </Suspense>
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
