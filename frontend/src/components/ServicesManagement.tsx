import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Clock, Repeat } from 'lucide-react'
import type { Service } from '../types'
import Button from './ui/Button'
import { cn } from '../lib/utils'
import ServiceModal from './ServiceModal'
import { servicesApi } from '../lib/api'

interface ServicesManagementProps {
  providerId: string
}

export default function ServicesManagement({ providerId }: ServicesManagementProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const loadServices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await servicesApi.getAll({ providerId, isActive: undefined })
      setServices(data as Service[])
    } catch (error) {
      console.error('Failed to load services:', error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }, [providerId])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const handleSaveService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      if (editingService) {
        await servicesApi.update(editingService.id, {
          ...serviceData,
          providerId
        })
        await loadServices()
        setEditingService(null)
      } else {
        await servicesApi.create({
          ...serviceData,
          providerId
        })
        await loadServices()
      }
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to save service:', error)
      alert('Failed to save service. Please try again.')
    }
  }

  const toggleServiceStatus = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (!service) return

    try {
      await servicesApi.update(serviceId, {
        isActive: !service.isActive
      })
      await loadServices()
    } catch (error) {
      console.error('Failed to update service status:', error)
      alert('Failed to update service status. Please try again.')
    }
  }

  const deleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesApi.delete(serviceId)
        await loadServices()
      } catch (error) {
        console.error('Failed to delete service:', error)
        alert('Failed to delete service. Please try again.')
      }
    }
  }

  const activeServices = services.filter(s => s.isActive)
  const inactiveServices = services.filter(s => !s.isActive)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Services Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your service offerings and pricing
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Services</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {services.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Services</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {activeServices.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Price</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            GHS {services.length > 0 
              ? Math.round(services.reduce((sum, s) => {
                  const price = s.pricingModel === 'pay-as-you-go' 
                    ? s.basePrice 
                    : (s.monthlyPrice || 0)
                  return sum + price
                }, 0) / services.length)
              : 0}
          </p>
        </div>
      </div>

      {/* Active Services */}
      {activeServices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Services ({activeServices.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => setEditingService(service)}
                onDelete={() => deleteService(service.id)}
                onToggleStatus={() => toggleServiceStatus(service.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Services */}
      {inactiveServices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Inactive Services ({inactiveServices.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => setEditingService(service)}
                onDelete={() => deleteService(service.id)}
                onToggleStatus={() => toggleServiceStatus(service.id)}
              />
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      )}

      {!loading && services.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No services yet. Add your first service to get started.
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      )}

      <ServiceModal
        isOpen={showAddModal || !!editingService}
        onClose={() => {
          setShowAddModal(false)
          setEditingService(null)
        }}
        onSave={handleSaveService}
        service={editingService}
      />
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
}

function ServiceCard({ service, onEdit, onDelete, onToggleStatus }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 transition-all",
        service.isActive 
          ? "border-gray-200 dark:border-gray-700 hover:shadow-md" 
          : "border-gray-300 dark:border-gray-600 opacity-75"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {service.name}
          </h4>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/20 text-gray-900 dark:text-white border border-primary/30">
            {service.category}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onToggleStatus}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={service.isActive ? 'Deactivate' : 'Activate'}
          >
            {service.isActive ? (
              <Eye className="h-4 w-4 text-green-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {service.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold",
            service.pricingModel === 'pay-as-you-go'
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
          )}>
            {service.pricingModel === 'pay-as-you-go' ? (
              <>
                <DollarSign className="h-3 w-3 inline mr-1" />
                Pay As You Go
              </>
            ) : (
              <>
                <Repeat className="h-3 w-3 inline mr-1" />
                Subscription
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {service.pricingModel === 'pay-as-you-go' ? (
            <>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  GHS {service.basePrice.toLocaleString()}
                </span>
                <span className="text-xs">/visit</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  GHS {service.monthlyPrice?.toLocaleString() || '0'}
                </span>
                <span className="text-xs">/{service.billingCycle || 'month'}</span>
              </div>
              {service.visitsPerPeriod && (
                <div className="text-xs">
                  {service.visitsPerPeriod} visits included
                </div>
              )}
              {!service.visitsPerPeriod && (
                <div className="text-xs text-green-600 dark:text-green-400">
                  Unlimited visits
                </div>
              )}
            </>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{service.duration} min</span>
          </div>
        </div>
        {service.pricingModel === 'subscription' && service.subscriptionFeatures && service.subscriptionFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {service.subscriptionFeatures.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {feature}
              </span>
            ))}
            {service.subscriptionFeatures.length > 3 && (
              <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                +{service.subscriptionFeatures.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 border-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

