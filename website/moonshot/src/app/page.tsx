import Home from '../components/Home'
import Swap from '../components/Swap'
import Asteroids from '../components/Asteroids'

export default function Page() {
  return (
    <main>
      <Home />
      <div className="section-divider" />
      <Swap />
      <div className="section-divider" />
      <Asteroids />
    </main>
  )
}