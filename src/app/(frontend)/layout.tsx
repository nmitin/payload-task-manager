import React from 'react'
import './styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/Navigation'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-4 text-center text-sm text-muted-foreground">
              <div className="container mx-auto">© {new Date().getFullYear()} Менеджер задач</div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
