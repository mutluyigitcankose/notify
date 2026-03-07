import { AuthSessionProvider } from "@/components/auth-session-provider";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";

const sans = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const serif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Tarihte Bugün",
  description: "Türkçe tarih olayları ve günlük mikroöğrenme bildirimleri.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable}`}>
        <ThemeProvider>
          <AuthSessionProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:py-10">
                {children}
              </main>
              <Footer />
            </div>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
