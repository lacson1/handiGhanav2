import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Subcategory {
  name: string
  description: string
}

interface Category {
  name: string
  icon: string
  subcategories: Subcategory[]
}

const categories: Category[] = [
  {
    name: 'Electrician',
    icon: '⚡',
    subcategories: [
      { name: 'Wiring & Installation', description: 'New wiring, outlets, switches' },
      { name: 'Lighting', description: 'Indoor & outdoor lighting' },
      { name: 'Repairs & Maintenance', description: 'Fix electrical issues' },
      { name: 'Emergency Service', description: '24/7 urgent repairs' }
    ]
  },
  {
    name: 'Plumber',
    icon: '🔧',
    subcategories: [
      { name: 'Leak Repair', description: 'Fix pipes, faucets, toilets' },
      { name: 'Installation', description: 'Bathroom, kitchen fixtures' },
      { name: 'Drain Cleaning', description: 'Unclog drains & sewers' },
      { name: 'Water Heater', description: 'Install & repair heaters' }
    ]
  },
  {
    name: 'Cleaner',
    icon: '🧹',
    subcategories: [
      { name: 'Home Cleaning', description: 'Regular house cleaning' },
      { name: 'Deep Cleaning', description: 'Thorough cleaning service' },
      { name: 'Office Cleaning', description: 'Commercial spaces' },
      { name: 'Move-In/Out', description: 'Pre/post moving cleaning' }
    ]
  },
  {
    name: 'Carpenter',
    icon: '🪚',
    subcategories: [
      { name: 'Furniture Making', description: 'Custom furniture design' },
      { name: 'Door & Window', description: 'Installation & repair' },
      { name: 'Cabinetry', description: 'Kitchen & bathroom cabinets' },
      { name: 'Woodwork Repair', description: 'Fix damaged wood items' }
    ]
  },
  {
    name: 'Painter',
    icon: '🎨',
    subcategories: [
      { name: 'Interior Painting', description: 'Indoor walls & ceilings' },
      { name: 'Exterior Painting', description: 'Outdoor walls & surfaces' },
      { name: 'Decorative', description: 'Special finishes & effects' },
      { name: 'Commercial', description: 'Office & building painting' }
    ]
  },
  {
    name: 'Mechanic',
    icon: '🔩',
    subcategories: [
      { name: 'Car Repair', description: 'Engine, brakes, transmission' },
      { name: 'Maintenance', description: 'Oil change, tune-ups' },
      { name: 'Diagnostics', description: 'Computer diagnostics' },
      { name: 'Mobile Service', description: 'On-site repairs' }
    ]
  },
  {
    name: 'Gardener',
    icon: '🌱',
    subcategories: [
      { name: 'Lawn Care', description: 'Mowing, edging, trimming' },
      { name: 'Landscaping', description: 'Design & installation' },
      { name: 'Tree Service', description: 'Pruning, removal' },
      { name: 'Garden Maintenance', description: 'Regular upkeep' }
    ]
  },
  {
    name: 'Other',
    icon: '✨',
    subcategories: [
      { name: 'Handyman', description: 'General repairs & fixes' },
      { name: 'Tiler', description: 'Floor & wall tiling' },
      { name: 'Welder', description: 'Metal work & fabrication' },
      { name: 'Network Setup', description: 'IT & networking' }
    ]
  }
]

export default function ServiceCategoriesEnhanced() {
  const navigate = useNavigate()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleCategoryClick = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryName)
    }
  }

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    navigate(`/search?category=${category}&subcategory=${encodeURIComponent(subcategory)}`)
  }

  return (
    <section id="providers" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find the right professional for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              {/* Main Category Card */}
              <button
                onClick={() => handleCategoryClick(category.name)}
                className={`w-full bg-white dark:bg-gray-800 border-2 rounded-xl p-6 transition-all text-center ${
                  expandedCategory === category.name
                    ? 'border-primary shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{category.subcategories.length} services</span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedCategory === category.name ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Subcategories Dropdown */}
              {expandedCategory === category.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 bg-white dark:bg-gray-800 border-2 border-primary rounded-xl overflow-hidden"
                >
                  {category.subcategories.map((sub, subIdx) => (
                    <button
                      key={subIdx}
                      onClick={() => handleSubcategoryClick(category.name, sub.name)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {sub.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {sub.description}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 text-primary hover:text-ghana-green font-semibold transition-colors"
          >
            View All Providers
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

