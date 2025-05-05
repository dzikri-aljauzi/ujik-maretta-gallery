import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { initializeData } from "@/lib/init-data"

// Initialize data on server startup
initializeData().catch(console.error)

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Our Gallery | Couple Photo Gallery",
  description: "A beautiful gallery showcasing our moments together",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-b from-[#FBE7C6]/30 to-[#FFAEBC]/10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
