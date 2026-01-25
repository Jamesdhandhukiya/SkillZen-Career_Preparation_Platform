import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { ResumeProvider } from "./contexts/ResumeContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkillZen - Master Your Career Journey",
  description: "Personalized preparation platform for placement drives, technical interviews, and career success.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <AuthProvider>
          <ResumeProvider>
            {children}
          </ResumeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
