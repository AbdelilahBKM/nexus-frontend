import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import StoreProvider from "@/store/authProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexus - IT Peer-to-Peer Learning Platform",
  description: "Connect, learn, and grow with fellow IT enthusiasts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

