import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CONFIG } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: CONFIG.title,
  description: CONFIG.description,
  keywords: ["Operations Architect", "Full-Stack Developer", "Sovereign Systems", "Next.js", "TypeScript", "Supply Chain Optimization", "AI System Design"],
  authors: [{ name: CONFIG.name }],
  openGraph: {
    title: CONFIG.title,
    description: CONFIG.description,
    url: 'https://wesleyquintero.com', // Replace with your actual domain
    siteName: CONFIG.title,
    images: [
      {
        url: '/og-image.png', // You should create this image later
        width: 1200,
        height: 630,
        alt: CONFIG.title,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: CONFIG.title,
    description: CONFIG.description,
    images: ['/og-image.png'],
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
