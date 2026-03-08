import { AuthSessionProvider } from "@/components/auth-session-provider";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ToasterProvider } from "@/components/ui/toaster";
import "@/app/globals.css";

const sans = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const serif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tarihtebugun.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Tarihte Bugün",
    template: "%s | Tarihte Bugün",
  },
  description: "Türkçe tarih olayları ve günlük mikroöğrenme bildirimleri.",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Tarihte Bugün",
    title: "Tarihte Bugün",
    description: "Türkçe tarih olayları ve günlük mikroöğrenme bildirimleri.",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarihte Bugün",
    description: "Türkçe tarih olayları ve günlük mikroöğrenme bildirimleri.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable}`}>
        <ThemeProvider>
          <AuthSessionProvider>
            <ToasterProvider>
            <div className="flex min-h-screen flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
              >
                İçeriğe atla
              </a>
              <Header />
              <main
                id="main-content"
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:py-10"
                tabIndex={-1}
              >
                {children}
              </main>
              <Footer />
            </div>
            </ToasterProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
