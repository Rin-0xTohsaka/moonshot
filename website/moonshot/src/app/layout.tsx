import '../styles/globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Stars from '../components/Stars'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Moonshot',
  description: 'Get Astronauts to the moon...again',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/moon.png" />
      </head>
      <body className={inter.className}>
        <Stars />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}