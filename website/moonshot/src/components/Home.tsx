'use client'
import Link from 'next/link'
import Lottie from 'lottie-react'
import animationData from '../../public/astronaut-animation.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  return (
    <section id="home" className="section">
      <div className="content">
        <div className="text-container">
          <h1 className="header">Moonshot</h1>
          <h2>Get Astronauts to the moon...again</h2>
          <div className="button-container">
            <Link href="#swap" className="button">Swap</Link>
            <Link href="#asteroids" className="button">Asteroids</Link>
          </div>
        </div>
        <div className="lottie-container">
          <Lottie animationData={animationData} style={{ width: 300, height: 300 }} />
        </div>
      </div>
      <div className="chevrons">
        <FontAwesomeIcon icon={faChevronDown} id="scroll-chevron" />
      </div>
    </section>
  )
}