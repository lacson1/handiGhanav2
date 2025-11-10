import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, AlertCircle, CheckCircle, Clock, 
  Filter, MessageSquare, DollarSign, Calendar, 
  User, Briefcase, FileText, Save, X
} from 'lucide-react'
import type { Dispute, DisputeStatus, DisputePriority } from '../types'
import Button from './ui/Button'
import { cn } from '../lib/utils'

export default function DisputeManagement() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')

  // Fetch disputes on mount
  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call when backend endpoint is ready
        setDisputes([])
      } catch (error) {
        console.error('Error fetching disputes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDisputes()
  }, [])
  const [adminNotes, setAdminNotes] = useState('')
  const [resolution, setResolution] = useState('')

  // Filter disputes
  const filteredDisputes = useMemo(() => {
    let filtered = [...disputes]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.customerName?.toLowerCase().includes(query) ||
        d.providerName?.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(d => d.priority === priorityFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(d => d.type === typeFilter)
    }

    // Sort by priority and date (most urgent and recent first)
    filtered.sort((a, b) => {
      const priorityOrder: Record<DisputePriority, number> = {
        'Urgent': 4,
        'High': 3,
        'Medium': 2,
        'Low': 1
      }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return filtered
  }, [disputes, searchQuery, statusFilter, priorityFilter, typeFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const total = disputes.length
    const open = disputes.filter(d => d.status === 'Open').length
    const inReview = disputes.filter(d => d.status === 'In Review').length
    const resolved = disputes.filter(d => d.status === 'Resolved').length
    const urgent = disputes.filter(d => d.priority === 'Urgent').length
    const totalRefunds = disputes
      .filter(d => d.refundAmount)
      .reduce((sum, d) => sum + (d.refundAmount || 0), 0)

    return {
      total,
      open,
      inReview,
      resolved,
      urgent,
      totalRefunds
    }
  }, [disputes])

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute)
    setAdminNotes(dispute.adminNotes || '')
    setResolution(dispute.resolution || '')
    setIsDetailModalOpen(true)
  }

  const handleUpdateStatus = (disputeId: string, newStatus: DisputeStatus) => {
    setDisputes(disputes.map(d => {
      if (d.id === disputeId) {
        const updated = {
          ...d,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
        if (newStatus === 'Resolved' || newStatus === 'Closed') {
          updated.resolvedAt = new Date().toISOString()
        }
        return updated
      }
      return d
    }))
    if (selectedDispute?.id === disputeId) {
      setSelectedDispute({
        ...selectedDispute,
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const handleUpdatePriority = (disputeId: string, newPriority: DisputePriority) => {
    setDisputes(disputes.map(d => 
      d.id === disputeId 
        ? { ...d, priority: newPriority, updatedAt: new Date().toISOString() }
        : d
    ))
    if (selectedDispute?.id === disputeId) {
      setSelectedDispute({
        ...selectedDispute,
        priority: newPriority,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const handleSaveNotes = () => {
    if (!selectedDispute) return
    setDisputes(disputes.map(d => 
      d.id === selectedDispute.id 
        ? { ...d, adminNotes, updatedAt: new Date().toISOString() }
        : d
    ))
    setSelectedDispute({ ...selectedDispute, adminNotes })
    alert('Admin notes saved successfully')
  }

  const handleSaveResolution = () => {
    if (!selectedDispute) return
    setDisputes(disputes.map(d => 
      d.id === selectedDispute.id 
        ? { 
            ...d, 
            resolution, 
            status: 'Resolved' as DisputeStatus,
            resolvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : d
    ))
    setSelectedDispute({ 
      ...selectedDispute, 
      resolution,
      status: 'Resolved',
      resolvedAt: new Date().toISOString()
    })
    alert('Resolution saved and dispute marked as resolved')
  }

  const getStatusColor = (status: DisputeStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'Escalated':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: DisputePriority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500'
      case 'High':
        return 'bg-orange-500'
      case 'Medium':
        return 'bg-yellow-500'
      case 'Low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dispute Management
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Review and resolve customer disputes and complaints
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Disputes', value: stats.total, icon: AlertCircle, color: 'blue' },
          { label: 'Open', value: stats.open, icon: Clock, color: 'red' },
          { label: 'In Review', value: stats.inReview, icon: FileText, color: 'yellow' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'green' },
          { label: 'Urgent', value: stats.urgent, icon: AlertCircle, color: 'red' },
          { label: 'Total Refunds', value: `GHS ${stats.totalRefunds.toLocaleString()}`, icon: DollarSign, color: 'purple' }
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
              <stat.icon className={cn("h-4 w-4", `text-${stat.color}-500`)} />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search disputes by title, customer, provider, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="all">All Types</option>
              <option value="Service Quality">Service Quality</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Cancellation">Cancellation</option>
              <option value="Refund Request">Refund Request</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dispute List */}
      <div className="space-y-4">
        {filteredDisputes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No disputes found matching your filters.
            </p>
          </div>
        ) : (
          filteredDisputes.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              onView={() => handleViewDispute(dispute)}
              onStatusChange={handleUpdateStatus}
              onPriorityChange={handleUpdatePriority}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedDispute && (
        <DisputeDetailModal
          dispute={selectedDispute}
          adminNotes={adminNotes}
          resolution={resolution}
          onAdminNotesChange={setAdminNotes}
          onResolutionChange={setResolution}
          onSaveNotes={handleSaveNotes}
          onSaveResolution={handleSaveResolution}
          onStatusChange={(status) => handleUpdateStatus(selectedDispute.id, status)}
          onPriorityChange={(priority) => handleUpdatePriority(selectedDispute.id, priority)}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedDispute(null)
            setAdminNotes('')
            setResolution('')
          }}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
        />
      )}
    </div>
  )
}

interface DisputeCardProps {
  dispute: Dispute
  onView: () => void
  onStatusChange: (id: string, status: DisputeStatus) => void
  onPriorityChange: (id: string, priority: DisputePriority) => void
  getStatusColor: (status: DisputeStatus) => string
  getPriorityColor: (priority: DisputePriority) => string
}

function DisputeCard({ 
  dispute, 
  onView, 
  onStatusChange, 
  onPriorityChange,
  getStatusColor,
  getPriorityColor
}: DisputeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("w-3 h-3 rounded-full", getPriorityColor(dispute.priority))} />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {dispute.title}
            </h3>
            <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getStatusColor(dispute.status))}>
              {dispute.status}
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
              {dispute.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {dispute.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {dispute.customerName || 'Customer'}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {dispute.providerName || 'Provider'}
            </span>
            {dispute.serviceType && (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {dispute.serviceType}
              </span>
            )}
            {dispute.amount && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                GHS {dispute.amount}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(dispute.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <select
            value={dispute.status}
            onChange={(e) => onStatusChange(dispute.id, e.target.value as DisputeStatus)}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold border-0 focus:ring-2 focus:ring-primary cursor-pointer",
              getStatusColor(dispute.status)
            )}
          >
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Escalated">Escalated</option>
          </select>
          <select
            value={dispute.priority}
            onChange={(e) => onPriorityChange(dispute.id, e.target.value as DisputePriority)}
            className="px-3 py-1 rounded-lg text-xs font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" size="sm" onClick={onView} className="flex-1">
          <MessageSquare className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </div>
    </motion.div>
  )
}

interface DisputeDetailModalProps {
  dispute: Dispute
  adminNotes: string
  resolution: string
  onAdminNotesChange: (notes: string) => void
  onResolutionChange: (resolution: string) => void
  onSaveNotes: () => void
  onSaveResolution: () => void
  onStatusChange: (status: DisputeStatus) => void
  onPriorityChange: (priority: DisputePriority) => void
  onClose: () => void
  getStatusColor: (status: DisputeStatus) => string
  getPriorityColor: (priority: DisputePriority) => string
}

function DisputeDetailModal({
  dispute,
  adminNotes,
  resolution,
  onAdminNotesChange,
  onResolutionChange,
  onSaveNotes,
  onSaveResolution,
  onStatusChange,
  onPriorityChange,
  onClose,
  getStatusColor,
  getPriorityColor
}: DisputeDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dispute Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ID: {dispute.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getStatusColor(dispute.status))}>
                {dispute.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</p>
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", getPriorityColor(dispute.priority))} />
                <span className="text-sm font-semibold">{dispute.priority}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
              <p className="text-sm font-semibold">{dispute.type}</p>
            </div>
            {dispute.amount && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                <p className="text-sm font-semibold">GHS {dispute.amount}</p>
              </div>
            )}
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {dispute.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dispute.description}
            </p>
          </div>

          {/* Parties */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {dispute.customerName || 'Unknown'}
              </p>
              {dispute.customerStatement && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statement:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {dispute.customerStatement}
                  </p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Provider
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {dispute.providerName || 'Unknown'}
              </p>
              {dispute.providerStatement && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statement:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {dispute.providerStatement}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Info */}
          {dispute.serviceType && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Booking Information
              </h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Service: </span>
                  <span className="font-semibold">{dispute.serviceType}</span>
                </div>
                {dispute.bookingDate && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Date: </span>
                    <span className="font-semibold">
                      {new Date(dispute.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Admin Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => onAdminNotesChange(e.target.value)}
              placeholder="Add internal notes about this dispute..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveNotes}
              className="mt-2"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Notes
            </Button>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Resolution
            </label>
            <textarea
              value={resolution}
              onChange={(e) => onResolutionChange(e.target.value)}
              placeholder="Enter resolution details..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px]"
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={onSaveResolution}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Save & Mark Resolved
              </Button>
            </div>
            {dispute.resolution && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Resolution:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{dispute.resolution}</p>
                {dispute.resolvedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Resolved: {new Date(dispute.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <select
              value={dispute.status}
              onChange={(e) => onStatusChange(e.target.value as DisputeStatus)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold border-0 focus:ring-2 focus:ring-primary cursor-pointer",
                getStatusColor(dispute.status)
              )}
            >
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Escalated">Escalated</option>
            </select>
            <select
              value={dispute.priority}
              onChange={(e) => onPriorityChange(e.target.value as DisputePriority)}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent</option>
            </select>
            <Button variant="outline" onClick={onClose} className="ml-auto">
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

