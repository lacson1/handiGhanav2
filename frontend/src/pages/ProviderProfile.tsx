import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, MapPin, CheckCircle, Clock, Phone, MessageCircle, 
  ArrowLeft, Calendar, Award, Users, TrendingUp, Shield, 
  Crown, Camera, Briefcase, Zap, Heart, Building2,
  DollarSign, Repeat, Check, Sparkles
} from 'lucide-react'
import { mockProviders } from '../data/mockProviders'
import { providerService } from '../services/providerService'
import BookingModal from '../components/BookingModal'
import BookingSuccessModal from '../components/BookingSuccessModal'
import ReviewList from '../components/ReviewList'
import Button from '../components/ui/Button'
import { useBookings } from '../hooks/useBookings'
import { useAuth } from '../context/AuthContext'
import { servicesApi } from '../lib/api'
import type { Service } from '../types'
import { cn } from '../lib/utils'

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { createBooking } = useBookings()
  const { isAuthenticated } = useAuth()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [provider, setProvider] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastBooking, setLastBooking] = useState<{ date: string; time: string; notes?: string } | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews' | 'portfolio'>('overview')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    const loadProvider = async () => {
      if (!id) {
        setError('No provider ID provided')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Try to get from API first
        const data = await providerService.getProviderById(id)
        if (data) {
          setProvider(data)
          // Load services
          try {
            const servicesData = await servicesApi.getAll({ providerId: id, isActive: true })
            setServices(servicesData as Service[])
          } catch (err) {
            console.error('Failed to load services:', err)
          }
        } else {
          // Fallback to mock data
          const found = mockProviders.find(p => p.id === id)
          if (found) {
            setProvider(found)
          } else {
            setError('Provider not found')
          }
        }
      } catch (err) {
        // Fallback to mock data on error
        const found = mockProviders.find(p => p.id === id)
        if (found) {
          setProvider(found)
          setError(null)
        } else {
          setError('Provider not found')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProvider()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading provider...</p>
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Provider Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The provider you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/')}>
                Browse Providers
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleWhatsApp = () => {
    if (provider.whatsapp) {
      window.open(`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')
    }
  }

  const handleCall = () => {
    if (provider.phone) {
      window.location.href = `tel:${provider.phone}`
    }
  }

  const handleBookingConfirm = (booking: { date: string; time: string; notes: string }) => {
    setLastBooking(booking)
    setIsBookingModalOpen(false)
    setIsSuccessModalOpen(true)
  }

  const getJoinedDate = () => {
    if (provider.joinedDate) {
      const date = new Date(provider.joinedDate)
      return date.toLocaleDateString('en-GH', { year: 'numeric', month: 'long' })
    }
    return 'Recently'
  }

  // Mock reviews
  const reviews = [
    {
      id: '1',
      userName: 'Kwame Asante',
      rating: 5,
      comment: 'Excellent work! Very professional and completed the job on time.',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      userName: 'Ama Mensah',
      rating: 5,
      comment: 'Highly recommend. Great service and fair pricing.',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      userName: 'John Doe',
      rating: 4,
      comment: 'Good work, but arrived a bit late. Overall satisfied.',
      createdAt: '2024-01-05'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header with Image */}
      <div className="relative h-80 bg-gradient-to-br from-primary via-primary/80 to-blue-600 overflow-hidden">
        {provider.image && (
          <img 
            src={provider.image} 
            alt={provider.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 mb-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-shrink-0 relative">
              <div className="relative">
                {provider.avatar || provider.image ? (
                  <img 
                    src={provider.avatar || provider.image} 
                    alt={provider.name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-white dark:border-gray-800 shadow-lg">
                    {provider.name.charAt(0)}
                  </div>
                )}
                {provider.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 border-4 border-white dark:border-gray-800">
                    <CheckCircle className="h-6 w-6 text-black" />
                  </div>
                )}
                {(provider as any).isPremium && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1.5 border-4 border-white dark:border-gray-800">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                      {provider.name}
                    </h1>
                    {provider.verified && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">Verified</span>
                      </div>
                    )}
                    {(provider as any).isPremium && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                        <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">Premium</span>
                      </div>
                    )}
                  </div>
                  <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2 font-medium">
                    <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>{provider.category}</span>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{provider.location}</span>
                  </p>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                          {provider.rating.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">
                          {provider.reviewCount} {provider.reviewCount === 1 ? 'review' : 'reviews'}
                        </p>
                      </div>
                    </div>
                    {provider.completionRate && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <Award className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                            {Math.round(provider.completionRate * 100)}%
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">Completion</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <Users className="h-6 w-6 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                          {getJoinedDate().split(' ')[0]}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">Joined</p>
                      </div>
                    </div>
                    {provider.availability === "Available Now" && (
                      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <Zap className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xl font-bold text-green-600 dark:text-green-400 leading-tight">
                            Now
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 leading-tight">Available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex-1 md:flex-none"
                  size="lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Service
                </Button>
                {provider.whatsapp && (
                  <Button 
                    variant="outline" 
                    onClick={handleWhatsApp}
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </Button>
                )}
                {provider.phone && (
                  <Button 
                    variant="outline" 
                    onClick={handleCall}
                    size="lg"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex gap-1 md:gap-2 overflow-x-auto pb-1">
              {[
                { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
                { id: 'services' as const, label: 'Services', icon: Briefcase },
                { id: 'reviews' as const, label: 'Reviews', icon: Star },
                { id: 'portfolio' as const, label: 'Portfolio', icon: Camera }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 md:px-6 py-3 border-b-2 transition-all whitespace-nowrap text-sm md:text-base",
                    activeTab === tab.id
                      ? "border-primary text-primary font-semibold bg-primary/5"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  )}
                >
                  <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  About
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-800 dark:text-gray-200 leading-7 text-base md:text-lg max-w-3xl">
                    {provider.description}
                  </p>
                </div>
              </div>

              {/* Service Areas & Skills */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {provider.serviceAreas && provider.serviceAreas.length > 0 && (
                  <div className="p-5 md:p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Service Areas
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {provider.serviceAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium border border-gray-200 dark:border-gray-600 shadow-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {provider.skills && provider.skills.length > 0 && (
                  <div className="p-5 md:p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {provider.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white dark:bg-blue-500 text-sm font-semibold shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="grid md:grid-cols-2 gap-4 p-6 md:p-8 bg-gradient-to-r from-blue-50 to-primary/10 dark:from-blue-900/20 dark:to-primary/20 rounded-xl border border-primary/20">
                <div className="flex items-start gap-4">
                  <Shield className="h-7 w-7 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">Verified Professional</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Background checked and verified</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-7 w-7 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">Quick Response</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Usually responds within hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Services Offered
                </h2>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {services.length} {services.length === 1 ? 'service' : 'services'} available
                </span>
              </div>
              {services.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary transition-all bg-white dark:bg-gray-800/50 hover:shadow-lg"
                    >
                      {/* Service Image */}
                      {service.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Pricing Model Badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {service.pricingModel === 'pay-as-you-go' ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Pay-as-you-go
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1">
                              <Repeat className="h-3 w-3" />
                              Subscription
                            </span>
                          )}
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration} min
                        </span>
                      </div>

                      {/* Service Name */}
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Pricing */}
                      <div className="mb-4 p-4 bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-900/20 rounded-lg border border-primary/10">
                        {service.pricingModel === 'pay-as-you-go' ? (
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                GHS {service.basePrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">per visit</span>
                            </div>
                            {service.basePrice > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                One-time payment
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                GHS {(service.monthlyPrice || 0).toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                /{service.billingCycle || 'month'}
                              </span>
                            </div>
                            {service.basePrice > 0 && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Setup fee: GHS {service.basePrice.toLocaleString()}
                              </p>
                            )}
                            {service.visitsPerPeriod !== null && service.visitsPerPeriod !== undefined && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {service.visitsPerPeriod === 0 ? 'Unlimited' : `${service.visitsPerPeriod} visits`} included
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Subscription Features */}
                      {service.pricingModel === 'subscription' && service.subscriptionFeatures && service.subscriptionFeatures.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Included Features:
                          </p>
                          <ul className="space-y-1.5">
                            {service.subscriptionFeatures.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Book Button */}
                      <Button
                        onClick={() => {
                          setSelectedService(service)
                          setIsBookingModalOpen(true)
                        }}
                        className="w-full mt-4"
                        size="lg"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book This Service
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No services listed yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Contact the provider directly to inquire about their services
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {provider.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({provider.reviewCount} {provider.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
              <ReviewList providerId={provider.id} />
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Portfolio
              </h2>
              {(provider as any).workPhotos && (provider as any).workPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {(provider as any).workPhotos.map((photo: string, idx: number) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <img
                        src={photo}
                        alt={`Work ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-base">No portfolio photos yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        provider={provider}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setSelectedService(null)
        }}
        onConfirm={handleBookingConfirm}
        showPayment={true}
        defaultService={selectedService || undefined}
      />

      {/* Booking Success Modal */}
      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        provider={provider}
        bookingDetails={lastBooking}
        onViewDashboard={() => {
          if (isAuthenticated) {
            navigate('/my-bookings')
          }
        }}
      />
    </div>
  )
}

