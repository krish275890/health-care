import type React from "react"
import { Inter } from "next/font/google"
import { ConfigProvider } from "antd"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Healthcare Clock",
  description: "Clock in and out application for healthcare workers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#0070f3",
              },
            }}
          >
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'