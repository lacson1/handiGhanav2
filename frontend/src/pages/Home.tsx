import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, CheckCircle, Shield, Clock, Award, ArrowRight, Star, Users, Briefcase } from 'lucide-react'

const categories = [
  { name: 'Electrician', icon: '⚡' },
  { name: 'Plumber', icon: '🔧' },
  { name: 'Cleaner', icon: '🧹' },
  { name: 'Carpenter', icon: '🪚' },
  { name: 'Painter', icon: '🎨' },
  { name: 'Mechanic', icon: '🔩' },
  { name: 'Gardener', icon: '🌱' },
  { name: 'Other', icon: '✨' },
]

export default function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [stats, setStats] = useState({
    totalProviders: 0,
    verifiedProviders: 0,
    averageRating: 0,
    totalReviews: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/providers`)
        const providers = await response.json()
        const verifiedCount = providers.filter((p: any) => p.verified).length
        const totalRatings = providers.reduce((sum: number, p: any) => sum + (p.rating || 0), 0)
        const totalReviews = providers.reduce((sum: number, p: any) => sum + (p.reviewCount || 0), 0)
        const avgRating = providers.length > 0 ? totalRatings / providers.length : 0

        setStats({
          totalProviders: providers.length,
          verifiedProviders: verifiedCount,
          averageRating: avgRating,
          totalReviews: totalReviews,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${searchQuery}&location=${location}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean with Ghanaian Accent */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Ghanaian Flag Accent - Subtle top border */}
            <div className="flex justify-center mb-8">
              <div className="flex h-1 w-32 rounded-full overflow-hidden shadow-sm">
                <div className="flex-1 bg-[#CE1126]"></div>
                <div className="flex-1 bg-[#FCD116]"></div>
                <div className="flex-1 bg-[#006B3F]"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Find Trusted Service Providers in Ghana
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
              Connect with verified professionals for all your home and business service needs
            </p>

            {/* Search Bar - With Ghanaian Gold Accent */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
              <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-[#FCD116] transition-colors p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#006B3F] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#005530] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Services Categories - Clean Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Services
            </h2>
            <p className="text-lg text-gray-600">
              Find the right professional for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/search?category=${category.name}`)}
                className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#FCD116] hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-900 group-hover:text-[#006B3F]">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features - With Ghanaian Accents */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why HandyGhana
            </h2>
            <p className="text-lg text-gray-600">
              Professional service delivery you can trust
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-[#CE1126] transition-colors">
              <div className="w-12 h-12 bg-[#CE1126]/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#CE1126]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Verified Professionals
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All service providers are background-checked and verified for your safety
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-[#FCD116] transition-colors">
              <div className="w-12 h-12 bg-[#FCD116]/20 rounded-lg flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-[#FCD116]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer Reviews
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Read authentic reviews from customers to make informed decisions
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-[#006B3F] transition-colors">
              <div className="w-12 h-12 bg-[#006B3F]/10 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-[#006B3F]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fast Booking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Book services instantly and get quick responses from providers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - With Ghana Colors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#CE1126] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find service providers by category or location
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FCD116] text-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Book
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Choose your preferred date and time for the service
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#006B3F] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Done
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Professional arrives and completes your job
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 bg-[#006B3F] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#005530] transition-colors shadow-lg"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Provider CTA - With Ghana Colors */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-6 text-[#FCD116]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Are You a Service Provider?
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Join our platform and connect with customers who need your services
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#006B3F] flex-shrink-0 mt-1" />
              <div>
                <div className="font-medium mb-1">Grow Your Business</div>
                <div className="text-sm text-gray-400">Reach more customers online</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FCD116] flex-shrink-0 mt-1" />
              <div>
                <div className="font-medium mb-1">Manage Bookings</div>
                <div className="text-sm text-gray-400">Easy scheduling system</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#CE1126] flex-shrink-0 mt-1" />
              <div>
                <div className="font-medium mb-1">Build Reputation</div>
                <div className="text-sm text-gray-400">Get reviews and ratings</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/register?role=provider')}
            className="inline-flex items-center gap-2 bg-[#FCD116] text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-[#e5bc00] transition-colors shadow-lg"
          >
            Register as Provider
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Stats Section - Moved to Bottom with Ghanaian Colors */}
      <section className="py-16 bg-gradient-to-r from-[#CE1126] via-[#FCD116] to-[#006B3F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.totalProviders > 0 ? stats.totalProviders : '...'}
              </div>
              <div className="text-sm text-white/90 font-medium">Service Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.verifiedProviders > 0 ? stats.verifiedProviders : stats.totalProviders > 0 ? stats.totalProviders : '...'}
              </div>
              <div className="text-sm text-white/90 font-medium">Verified Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-1">
                5.0
                <Star className="w-6 h-6 fill-white" />
              </div>
              <div className="text-sm text-white/90 font-medium">Platform Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.totalReviews > 0 ? stats.totalReviews : stats.totalProviders > 0 ? stats.totalProviders : '...'}
              </div>
              <div className="text-sm text-white/90 font-medium">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">
            Ready to find your next service provider?
          </p>
          <button
            onClick={() => navigate('/search')}
            className="text-[#006B3F] font-semibold hover:text-[#005530] inline-flex items-center gap-2"
          >
            Browse All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
