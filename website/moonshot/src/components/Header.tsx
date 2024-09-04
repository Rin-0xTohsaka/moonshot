'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <nav>
        <ul className={`menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link href="#home">Home</Link></li>
          <li><Link href="#swap">Swap</Link></li>
          <li><Link href="#asteroids">Asteroids</Link></li>
        </ul>
      </nav>
      <button 
        id="mobile-menu-toggle" 
        aria-label="Toggle menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>
    </header>
  )
}