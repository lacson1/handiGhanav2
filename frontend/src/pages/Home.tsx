import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Shield, Clock, ArrowRight, Star, Users, Briefcase, Heart, TrendingUp } from 'lucide-react'
import { StatsCardSkeleton } from '../components/LoadingSkeleton'
import KentePattern from '../components/KentePattern'
import SearchBar from '../components/SearchBar'
import { useProviders } from '../hooks/useProviders'
import { usePlatformStats } from '../hooks/useStats'
import type { Provider } from '../types'

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
  
  // Use React Query hooks for cached data
  const { data: providers = [], isLoading: isLoadingProviders } = useProviders()
  const { data: platformStats, isLoading: isLoadingStats } = usePlatformStats()

  // Compute stats from providers if platformStats is not available
  const stats = platformStats || {
    totalProviders: providers.length,
    verifiedProviders: providers.filter((p: Provider) => p.verified).length,
    averageRating: providers.length > 0 
      ? providers.reduce((sum: number, p: Provider) => sum + (p.rating || 0), 0) / providers.length 
      : 0,
    totalReviews: providers.reduce((sum: number, p: Provider) => sum + (p.reviewCount || 0), 0),
  }

  // Handle navigation with hash anchors
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [])

  const handleSearch = (filters: { category?: string; location?: string; query?: string }) => {
    const params = new URLSearchParams()
    if (filters.query) params.append('q', filters.query)
    if (filters.category) params.append('category', filters.category)
    if (filters.location) params.append('location', filters.location)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Kente Background Pattern */}
      <KentePattern variant="background" colors="ghana" />

      {/* Hero Section - Clean with Ghanaian Accent */}
      <section className="relative bg-linear-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Kente Divider at Top */}
            <KentePattern variant="divider" colors="ghana" className="mb-8" />

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Find Trusted Service Providers in Ghana
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
              Connect with verified professionals for all your home and business service needs
            </p>

            {/* Enhanced Search Bar with Smart Suggestions */}
            <div className="max-w-3xl mx-auto mb-12">
              <SearchBar
                onSearch={handleSearch}
                providers={providers}
                onProviderSelect={(provider) => navigate(`/provider/${provider.id}`)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Categories - Clean Grid */}
      <section id="providers" className="py-20 bg-white">
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
                className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-900 group-hover:text-ghana-green">
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
              Why Handighana
            </h2>
            <p className="text-lg text-gray-600">
              Professional service delivery you can trust
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-ghana-red transition-colors">
              <div className="w-12 h-12 bg-ghana-red-subtle rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-ghana-red" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Trusted Professionals
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with service providers reviewed and rated by our community
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-ghana-yellow-subtle rounded-lg flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer Reviews
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Read authentic reviews from customers to make informed decisions
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-ghana-green transition-colors">
              <div className="w-12 h-12 bg-ghana-green-subtle rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-ghana-green" />
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
      <section id="how-it-works" className="py-20 bg-white">
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
              <div className="w-16 h-16 bg-ghana-red text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
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
              <div className="w-16 h-16 bg-primary text-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
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
              <div className="w-16 h-16 bg-ghana-green text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
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
              className="inline-flex items-center gap-2 bg-ghana-green text-white px-8 py-4 rounded-lg font-medium hover:bg-ghana-green-dark transition-colors shadow-lg"
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
          <Briefcase className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Are You a Service Provider?
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Join our platform and connect with customers who need your services
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-ghana-green shrink-0 mt-1" />
              <div>
                <div className="font-medium mb-1">Grow Your Business</div>
                <div className="text-sm text-gray-400">Reach more customers online</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
              <div>
                <div className="font-medium mb-1">Manage Bookings</div>
                <div className="text-sm text-gray-400">Easy scheduling system</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-ghana-red shrink-0 mt-1" />
              <div>
                <div className="font-medium mb-1">Build Reputation</div>
                <div className="text-sm text-gray-400">Get reviews and ratings</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/register?role=provider')}
            className="inline-flex items-center gap-2 bg-primary text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg"
          >
            Register as Provider
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Stats Section - Enhanced with Icons and Animations */}
      <section className="py-16 md:py-20 bg-linear-to-r from-ghana-red via-primary to-ghana-green relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-size-[40px_40px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Trusted by Thousands Across Ghana
            </h2>
            <p className="text-white/90 text-lg">
              Join our growing community of satisfied customers and professionals
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {isLoadingStats ? (
              <>
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </>
            ) : (
              <>
                {/* Service Providers */}
                <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                    {stats.totalProviders > 0 ? `${stats.totalProviders}+` : '0+'}
                  </div>
                  <div className="text-sm md:text-base text-white/90 font-medium">Service Providers</div>
                </div>

                {/* Trusted Professionals */}
                <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                    {stats.verifiedProviders}
                  </div>
                  <div className="text-sm md:text-base text-white/90 font-medium">Trusted Professionals</div>
                </div>

                {/* Platform Rating */}
                <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <Star className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2 tabular-nums">
                    <span>{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}</span>
                    {stats.averageRating > 0 && <TrendingUp className="w-6 h-6 text-white" />}
                  </div>
                  <div className="text-sm md:text-base text-white/90 font-medium">Platform Rating</div>
                </div>

                {/* Happy Customers */}
                <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <Heart className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                    {stats.totalReviews > 0 ? `${stats.totalReviews}+` : '0+'}
                  </div>
                  <div className="text-sm md:text-base text-white/90 font-medium">Total Reviews</div>
                </div>
              </>
            )}
          </div>

          {/* Trust Badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-white font-medium">100% Verified Service Providers</span>
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
            className="text-ghana-green font-semibold hover:text-ghana-green-dark inline-flex items-center gap-2"
          >
            Browse All Services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
