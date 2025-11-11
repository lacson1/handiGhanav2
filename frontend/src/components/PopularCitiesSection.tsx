import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const popularCities = [
  { name: 'Accra', icon: '🏙️', providers: '200+', description: 'Capital & Largest City' },
  { name: 'Kumasi', icon: '🌆', providers: '150+', description: 'Garden City' },
  { name: 'Takoradi', icon: '⚓', providers: '80+', description: 'Oil City' },
  { name: 'Tamale', icon: '🌾', providers: '60+', description: 'Northern Hub' },
  { name: 'Cape Coast', icon: '🏖️', providers: '50+', description: 'Tourist Paradise' },
  { name: 'Tema', icon: '🚢', providers: '90+', description: 'Harbor City' },
]

export default function PopularCitiesSection() {
  const navigate = useNavigate()

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Cities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find trusted service providers across Ghana's major cities
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCities.map((city, idx) => (
            <motion.button
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(`/search?location=${city.name}`)}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-primary text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {city.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                {city.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {city.description}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-primary">
                <MapPin className="h-3 w-3" />
                {city.providers} providers
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 text-primary hover:text-ghana-green font-semibold transition-colors"
          >
            View All Locations
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

