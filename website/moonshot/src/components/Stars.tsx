'use client'
import { useEffect, useRef } from 'react'

export default function Stars() {
  const starsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use non-null assertion operator here
    const starsContainer = starsContainerRef.current!

    const numStars = 200
    const shootingStarInterval = 2000

    function createStar() {
      const star = document.createElement('div')
      star.classList.add('star')
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.width = `${Math.random() * 3 + 1}px`
      star.style.height = `${Math.random() * 3 + 1}px`
      star.style.animationDuration = `${Math.random() * 3 + 1}s`
      star.style.animationDelay = `${Math.random() * 3}s`
      starsContainer.appendChild(star)
    }

    function createShootingStar() {
      const shootingStar = document.createElement('div')
      shootingStar.classList.add('shooting-star')
      shootingStar.style.top = `${Math.random() * 50}%`
      shootingStar.style.left = `${Math.random() * 100}%`
      shootingStar.style.animationDuration = `${Math.random() * 4 + 1}s`
      shootingStar.style.animationDelay = `${Math.random() * 4}s`
      starsContainer.appendChild(shootingStar)

      shootingStar.addEventListener('animationend', () => {
        shootingStar.remove()
      })
    }

    function triggerShootingStars() {
      createShootingStar()
      const nextShootingStarIn = Math.random() * 2000 + shootingStarInterval
      setTimeout(triggerShootingStars, nextShootingStarIn)
    }

    function initStars() {
      for (let i = 0; i < numStars; i++) {
        createStar()
      }
    }

    initStars()
    triggerShootingStars()

    return () => {
      // Clean up stars when component unmounts
      starsContainer.innerHTML = ''
    }
  }, [])

  return <div id="stars-container" ref={starsContainerRef}></div>
}