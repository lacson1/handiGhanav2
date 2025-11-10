import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Shield, Clock, Award, ArrowRight, CheckCircle, TrendingUp, Users } from 'lucide-react'
import TrustBadges from '../components/TrustBadges'
import TestimonialsSection from '../components/TestimonialsSection'
import FAQSection from '../components/FAQSection'
import StatsSection from '../components/StatsSection'
import { providersApi } from '../lib/api'

const categories = [
  { name: 'Electrician', icon: '⚡', count: 45 },
  { name: 'Plumber', icon: '🔧', count: 38 },
  { name: 'Cleaner', icon: '🧹', count: 62 },
  { name: 'Carpenter', icon: '🔨', count: 29 },
  { name: 'Painter', icon: '🎨', count: 34 },
  { name: 'Mechanic', icon: '🔩', count: 28 },
  { name: 'Gardener', icon: '🌱', count: 19 },
  { name: 'Other', icon: '✨', count: 15 },
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
    // Fetch real stats from API
    const fetchStats = async () => {
      try {
        const providers = await providersApi.getAll()
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
        // Keep initial values (0) if fetch fails
      }
    }

    fetchStats()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${searchQuery}&location=${location}`)
  }

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All service providers are background-checked and verified',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Star,
      title: 'Top-Rated Services',
      description: 'Read reviews from real customers before you book',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Get instant quotes and same-day service availability',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Satisfaction guarantee on all completed services',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Search & Compare',
      description: 'Browse verified service providers in your area',
      color: 'bg-blue-600'
    },
    {
      step: '2',
      title: 'Book Instantly',
      description: 'Choose your date, time, and service details',
      color: 'bg-purple-600'
    },
    {
      step: '3',
      title: 'Get It Done',
      description: 'Professional arrives on time and completes the job',
      color: 'bg-green-600'
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find Trusted Service
              <span className="block text-yellow-300">Providers in Ghana</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Connect with verified professionals for home repairs, maintenance, and more
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Search
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Quick Stats - Real Data */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-1">
                {stats.totalProviders > 0 ? `${stats.totalProviders}` : '...'}
              </div>
              <div className="text-indigo-100">Service Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-1">
                {stats.verifiedProviders > 0 ? `${stats.verifiedProviders}` : '...'}
              </div>
              <div className="text-indigo-100">Verified Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-1">
                {stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)}★` : 'New'}
              </div>
              <div className="text-indigo-100">Platform Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-1">
                {stats.totalReviews > 0 ? `${stats.totalReviews}` : 'New'}
              </div>
              <div className="text-indigo-100">Reviews</div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="relative">
          <svg className="w-full h-16 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-lg text-gray-600">
              Browse by category to find the perfect professional for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/search?category=${category.name}`)}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-indigo-300"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count} providers
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HandyGhana?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find, book, and manage all your home service needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`${feature.bg} ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your job done in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative text-center">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-indigo-200 to-purple-200 -z-10" />
                )}
                <div className={`${item.color} w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                  <span className="text-5xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <TrustBadges />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Are You a Service Provider?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join our platform and connect with thousands of customers looking for your services
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span>Get More Customers</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <TrendingUp className="w-6 h-6 text-green-300" />
              <span>Grow Your Business</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Users className="w-6 h-6 text-green-300" />
              <span>Build Your Reputation</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/register?role=provider')}
            className="bg-white text-indigo-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-2xl inline-flex items-center gap-3"
          >
            Register as Provider
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
