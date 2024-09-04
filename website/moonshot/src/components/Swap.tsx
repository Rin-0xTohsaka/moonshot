'use client'
import { LiFiWidget } from '@lifi/widget'

export default function Swap() {
  return (
    <section id="swap" className="section">
      <h2>Moonshot cross-chain swap</h2>
      <p>Swap any token from supported networks for Moon</p>
      <div id="lifi-widget-container">
        <LiFiWidget integrator="moonshot" />
      </div>
    </section>
  )
}