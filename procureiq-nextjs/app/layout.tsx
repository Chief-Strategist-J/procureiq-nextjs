"use client"

import React from "react"
import { ThemeProvider } from "next-themes"
import { Header, Footer } from "@shared/index"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header activePath="/" />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
