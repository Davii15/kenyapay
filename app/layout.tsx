import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KenyaPay - Currency Exchange for Tourists",
  description: "Convert your currency to Kenyan Shillings and pay local businesses with ease.",
  keywords: ["Kenya", "tourism", "currency exchange", "payments", "safari", "travel", "wallet", "QR code"],
  authors: [{ name: "KenyaPay Team" }],
  creator: "KenyaPay",
  publisher: "KenyaPay",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kenyapay.com",
    title: "KenyaPay - Currency Exchange for Tourists",
    description: "Convert your currency to Kenyan Shillings and pay local businesses with ease.",
    siteName: "KenyaPay",
  },
  twitter: {
    card: "summary_large_image",
    title: "KenyaPay - Currency Exchange for Tourists",
    description: "Convert your currency to Kenyan Shillings and pay local businesses with ease.",
    creator: "@kenyapay",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
