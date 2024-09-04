import React from 'react';

export default function Asteroids() {
    return (
      <section id="asteroids" className="asteroids-section">
        <h2>Asteroids Game</h2>
        <p className="asteroids-message">The galaxy needs you, cadet!</p>
        <a 
          href="https://asteroids-game-zeta.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="retro-button"
        >
          Play
        </a>
      </section>
    )
}