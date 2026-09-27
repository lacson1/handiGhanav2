import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Zap, BrushCleaning, Hammer, PaintRoller, Wrench, Sprout, CircleEllipsis } from 'lucide-react'
import HomeSearch from '../components/HomeSearch'
import PlumbingIcon from '../components/PlumbingIcon'
import './Home.css'

const categories = [
  { name: 'Electrician', icon: Zap },
  { name: 'Plumber', icon: PlumbingIcon },
  { name: 'Cleaner', icon: BrushCleaning },
  { name: 'Carpenter', icon: Hammer },
  { name: 'Painter', icon: PaintRoller },
  { name: 'Mechanic', icon: Wrench },
  { name: 'Gardener', icon: Sprout },
  { name: 'Other', icon: CircleEllipsis },
]
const steps = [
  { title: 'Search', text: 'Find professionals by service and location.' },
  { title: 'Compare', text: 'Explore profiles and customer reviews.' },
  { title: 'Book', text: 'Choose a time that works for you.' },
]
const cities = ['Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Cape Coast', 'Tema']

export default function Home() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <div className="home-page">
      <section className="home-hero home-container" aria-labelledby="home-title">
        <h1 id="home-title">Find the right help.<br /><span>Right here in Ghana.</span></h1>
        <p>Connect with local professionals for your home and business.</p>
        <HomeSearch />
      </section>

      <section id="providers" className="home-services home-container" aria-labelledby="services-title">
        <div className="home-section-heading">
          <h2 id="services-title">Browse services</h2>
          <Link className="home-text-link" to="/search">View all services <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="home-category-grid">
          {categories.map(({ name, icon: Icon }) => (
            <Link key={name} className="home-category" to={`/search?category=${encodeURIComponent(name)}`}>
              <Icon size={38} strokeWidth={1.6} aria-hidden="true" />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="home-how" aria-labelledby="how-title">
        <div className="home-container">
          <h2 id="how-title">A little help. A simpler day.</h2>
          <ol className="home-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="home-step-number" aria-hidden="true">{index + 1}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-cities home-container" aria-labelledby="cities-title">
        <h2 id="cities-title">Find help near you</h2>
        <div className="home-city-links">
          {cities.map(city => <Link key={city} to={`/search?location=${encodeURIComponent(city)}`}>{city}</Link>)}
        </div>
      </section>

      <section className="home-provider" aria-labelledby="provider-title">
        <div className="home-container home-provider-inner">
          <div><h2 id="provider-title">Your skills. More opportunities.</h2><p>Connect with customers who need your services.</p></div>
          <Link to="/become-provider">Become a Provider <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  )
}
