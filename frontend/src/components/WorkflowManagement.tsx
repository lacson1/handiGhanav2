import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, Clock, AlertCircle, XCircle, 
  Plus, Filter, Calendar, FileText, Edit, Search,
  Trash2, Copy, ChevronDown, ChevronUp, SortAsc, X,
  TrendingUp, BarChart3, Tag, Timer, Zap, Layers,
  Play, Square
} from 'lucide-react'
import { taskTemplates } from '../data/taskTemplates'
import { useBookings } from '../hooks/useBookings'
import type { WorkflowTask, TaskTemplate } from '../types'
import Button from './ui/Button'
import { cn } from '../lib/utils'
import TaskModal from './TaskModal'

interface WorkflowManagementProps {
  providerId: string
}

export default function WorkflowManagement({ providerId }: WorkflowManagementProps) {
  const [activeView, setActiveView] = useState<'board' | 'list' | 'calendar' | 'stats'>('board')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [tasks, setTasks] = useState<WorkflowTask[]>([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<WorkflowTask | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt' | 'title'>('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [draggedTask, setDraggedTask] = useState<WorkflowTask | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [showTemplates, setShowTemplates] = useState(false)
  const [trackingTaskId, setTrackingTaskId] = useState<string | null>(null)
  const [trackingStartTime, setTrackingStartTime] = useState<number | null>(null)
  const [trackedTime, setTrackedTime] = useState<Record<string, number>>({})
  const { bookings } = useBookings()

  // Auto-create tasks from confirmed bookings
  useEffect(() => {
    if (!bookings.length || !providerId) return
    
    // Use functional update to avoid dependency on tasks
    setTasks(prevTasks => {
      const confirmedBookings = bookings.filter(b => 
        b.status === 'Confirmed' && 
        b.providerId === providerId
      )

      if (confirmedBookings.length === 0) return prevTasks

      const existingBookingIds = new Set(prevTasks.map(t => t.bookingId))
      const newBookings = confirmedBookings.filter(b => !existingBookingIds.has(b.id))
      
      if (newBookings.length === 0) return prevTasks

      const newTasks: WorkflowTask[] = []
      
      newBookings.forEach(booking => {
        const template = taskTemplates.find(t => 
          t.category.toLowerCase() === booking.serviceType.toLowerCase().split(' ')[0]
        )

        if (template) {
          const templateTasks: WorkflowTask[] = template.tasks.map((templateTask, idx) => ({
            ...templateTask,
            id: `task-${Date.now()}-${booking.id}-${idx}`,
            bookingId: booking.id,
            status: 'Not Started' as const,
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toISOString()
          }))
          newTasks.push(...templateTasks)
        } else {
          // Create default tasks if no template matches
          const defaultTasks: WorkflowTask[] = [
            {
              id: `task-${Date.now()}-${booking.id}-1`,
              bookingId: booking.id,
              title: `Prepare for ${booking.serviceType}`,
              description: `Prepare materials and tools for ${booking.serviceType}`,
              status: 'Not Started',
              priority: 'High',
              dueDate: new Date(booking.date).toISOString(),
              createdAt: new Date().toISOString(),
              tags: ['preparation']
            },
            {
              id: `task-${Date.now()}-${booking.id}-2`,
              bookingId: booking.id,
              title: `Complete ${booking.serviceType}`,
              description: `Complete the ${booking.serviceType} service`,
              status: 'Not Started',
              priority: 'Urgent',
              dueDate: new Date(booking.date).toISOString(),
              createdAt: new Date().toISOString(),
              tags: ['work']
            }
          ]
          newTasks.push(...defaultTasks)
        }
      })
      
      return [...prevTasks, ...newTasks]
    })
  }, [bookings, providerId])

  // Time tracking
  useEffect(() => {
    if (trackingTaskId && trackingStartTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - trackingStartTime) / (1000 * 60 * 60) // hours
        setTrackedTime(prev => ({
          ...prev,
          [trackingTaskId]: (prev[trackingTaskId] || 0) + elapsed / 60 // Convert to minutes for update
        }))
        setTrackingStartTime(Date.now())
      }, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [trackingTaskId, trackingStartTime])

  const startTimeTracking = (taskId: string) => {
    if (trackingTaskId) {
      // Stop current tracking
      stopTimeTracking()
    }
    setTrackingTaskId(taskId)
    setTrackingStartTime(Date.now())
  }

  const stopTimeTracking = () => {
    if (trackingTaskId && trackingStartTime) {
      const elapsed = (Date.now() - trackingStartTime) / (1000 * 60 * 60) // hours
      setTasks(prev => prev.map(t => 
        t.id === trackingTaskId 
          ? { ...t, actualHours: (t.actualHours || 0) + elapsed }
          : t
      ))
    }
    setTrackingTaskId(null)
    setTrackingStartTime(null)
  }

  const handleSaveTask = (taskData: Omit<WorkflowTask, 'id' | 'createdAt'>) => {
    if (editingTask) {
      setTasks(tasks.map(t => 
        t.id === editingTask.id ? { ...t, ...taskData } : t
      ))
      setEditingTask(null)
    } else {
      const newTask: WorkflowTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
      setTasks([...tasks, newTask])
    }
    setShowTaskModal(false)
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId))
      setSelectedTasks(prev => {
        const next = new Set(prev)
        next.delete(taskId)
        return next
      })
    }
  }

  const handleDuplicateTask = (task: WorkflowTask) => {
    const newTask: WorkflowTask = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`,
      status: 'Not Started',
      createdAt: new Date().toISOString()
    }
    setTasks([...tasks, newTask])
  }

  const handleMarkComplete = (taskId: string) => {
    if (trackingTaskId === taskId) {
      stopTimeTracking()
    }
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'Completed' as const, completedAt: new Date().toISOString() } : t
    ))
  }

  const handleCreateFromTemplate = (template: TaskTemplate, bookingId: string) => {
    const newTasks: WorkflowTask[] = template.tasks.map((templateTask, idx) => ({
      ...templateTask,
      id: `task-${Date.now()}-${idx}`,
      bookingId,
      status: 'Not Started' as const,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toISOString()
    }))
    setTasks(prev => [...prev, ...newTasks])
    setShowTemplates(false)
  }

  const handleBulkDelete = () => {
    if (selectedTasks.size === 0) return
    if (confirm(`Are you sure you want to delete ${selectedTasks.size} task(s)?`)) {
      setTasks(tasks.filter(t => !selectedTasks.has(t.id)))
      setSelectedTasks(new Set())
    }
  }

  const handleBulkComplete = () => {
    if (selectedTasks.size === 0) return
    setTasks(tasks.map(t => 
      selectedTasks.has(t.id) ? { ...t, status: 'Completed' as const } : t
    ))
    setSelectedTasks(new Set())
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  const handleDragStart = (task: WorkflowTask) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (newStatus: WorkflowTask['status']) => {
    if (draggedTask) {
      setTasks(tasks.map(t => 
        t.id === draggedTask.id ? { ...t, status: newStatus } : t
      ))
      setDraggedTask(null)
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query)
      )
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase().replace(' ', ''))
    }
    
    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority.toLowerCase() === priorityFilter.toLowerCase())
    }
    
    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(t => t.tags?.includes(selectedTag))
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          break
        case 'priority':
          const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
          comparison = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return filtered
  }, [tasks, statusFilter, priorityFilter, searchQuery, sortBy, sortOrder])

  // Group tasks by status for board view
  const tasksByStatus = useMemo(() => {
    const groups = {
      'Not Started': filteredTasks.filter(t => t.status === 'Not Started'),
      'In Progress': filteredTasks.filter(t => t.status === 'In Progress'),
      'Completed': filteredTasks.filter(t => t.status === 'Completed'),
      'Blocked': filteredTasks.filter(t => t.status === 'Blocked')
    }
    return groups
  }, [filteredTasks])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return CheckCircle
      case 'In Progress':
        return Clock
      case 'Blocked':
        return AlertCircle
      default:
        return XCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'High':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getBookingInfo = (bookingId: string) => {
    return bookings.find(b => b.id === bookingId) || mockBookings.find(b => b.id === bookingId)
  }

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'Completed').length
    const inProgress = tasks.filter(t => t.status === 'In Progress').length
    const overdue = tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'Completed').length
    const completionRate = total > 0 ? (completed / total) * 100 : 0
    const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)
    const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0)
    const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])))

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate,
      totalEstimatedHours,
      totalActualHours,
      allTags
    }
  }, [tasks])

  // Get unique tags from all tasks
  const allTags = useMemo(() => {
    return Array.from(new Set(tasks.flatMap(t => t.tags || [])))
  }, [tasks])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Workflow Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track and manage your job tasks and workflow
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Layers className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => setShowTaskModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Task Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Task Templates</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Select Booking
                </label>
                <select
                  id="template-booking-select"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="">Select a booking...</option>
                  {bookings.filter(b => b.providerId === providerId && b.status === 'Confirmed').map(booking => (
                    <option key={booking.id} value={booking.id}>
                      {booking.serviceType} - {new Date(booking.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {taskTemplates.map(template => (
                  <div
                    key={template.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{template.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      {template.tasks.length} tasks
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => {
                        const select = document.getElementById('template-booking-select') as HTMLSelectElement
                        const bookingId = select?.value
                        if (bookingId) {
                          handleCreateFromTemplate(template, bookingId)
                        } else {
                          alert('Please select a booking first')
                        }
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.completionRate.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Hours</span>
            <Timer className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalEstimatedHours.toFixed(1)}h
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Actual Hours</span>
            <Clock className="h-5 w-5 text-purple-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalActualHours.toFixed(1)}h
          </span>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'board', label: 'Board', icon: FileText },
          { id: 'list', label: 'List', icon: FileText },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'stats', label: 'Analytics', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors",
              activeView === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="all">All Status</option>
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="createdAt">Sort by Created</option>
            <option value="title">Sort by Title</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {selectedTasks.size} task(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkComplete}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTasks(new Set())}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Board View */}
      {activeView === 'board' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Object.entries(tasksByStatus).map(([status, columnTasks]) => (
            <div
              key={status}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status as WorkflowTask['status'])}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{status}</h3>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnTasks.map((task) => {
                  const booking = getBookingInfo(task.bookingId)
                  const StatusIcon = getStatusIcon(task.status)
                  const overdue = isOverdue(task.dueDate)
                  const isSelected = selectedTasks.has(task.id)
                  return (
                    <motion.div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      className={cn(
                        "p-3 rounded-lg border transition-all cursor-move relative group",
                        isSelected 
                          ? "bg-primary/10 dark:bg-primary/20 border-primary" 
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600",
                        overdue && "border-red-300 dark:border-red-700",
                        "hover:shadow-md"
                      )}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return
                        toggleTaskSelection(task.id)
                      }}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleTaskSelection(task.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={cn(
                              "font-semibold text-sm",
                              task.status === 'Completed' ? "line-through text-gray-500" : "text-gray-900 dark:text-white"
                            )}>
                              {task.title}
                            </h4>
                            <StatusIcon className={cn("h-4 w-4 flex-shrink-0", 
                              task.status === 'Completed' ? 'text-green-500' :
                              task.status === 'In Progress' ? 'text-blue-500' :
                              task.status === 'Blocked' ? 'text-red-500' : 'text-gray-500'
                            )} />
                          </div>
                          {overdue && (
                            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mb-1">
                              <AlertCircle className="h-3 w-3" />
                              Overdue
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 ml-6">
                        {task.description}
                      </p>
                      {booking && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 ml-6">
                          {booking.serviceType}
                        </p>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 ml-6">
                          {task.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {(task.estimatedHours || task.actualHours) && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 ml-6">
                          {task.estimatedHours && (
                            <span>Est: {task.estimatedHours}h</span>
                          )}
                          {task.actualHours && (
                            <span>Actual: {task.actualHours.toFixed(1)}h</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2 ml-6">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getPriorityColor(task.priority))}>
                          {task.priority}
                        </span>
                        <span className={cn(
                          "text-xs",
                          overdue ? "text-red-600 dark:text-red-400 font-semibold" : "text-gray-500 dark:text-gray-400"
                        )}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1 flex-col">
                          {trackingTaskId === task.id ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                stopTimeTracking()
                              }}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                              title="Stop tracking"
                            >
                              <Square className="h-3 w-3" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                startTimeTracking(task.id)
                              }}
                              className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              title="Start time tracking"
                            >
                              <Play className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkComplete(task.id)
                            }}
                            className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
                            title="Mark complete"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDuplicateTask(task)
                            }}
                            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            title="Duplicate"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingTask(task)
                              setShowTaskModal(true)
                            }}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                            title="Edit"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTask(task.id)
                            }}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                {columnTasks.length === 0 && (
                  <div className="text-sm text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* List View */}
      {activeView === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const booking = getBookingInfo(task.bookingId)
              const StatusIcon = getStatusIcon(task.status)
              const overdue = isOverdue(task.dueDate)
              const isSelected = selectedTasks.has(task.id)
              return (
                <div
                  key={task.id}
                  className={cn(
                    "border rounded-xl p-4 hover:shadow-md transition-all relative group",
                    isSelected 
                      ? "bg-primary/10 dark:bg-primary/20 border-primary" 
                      : "border-gray-200 dark:border-gray-700",
                    overdue && "border-red-300 dark:border-red-700"
                  )}
                  onClick={() => toggleTaskSelection(task.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTaskSelection(task.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <StatusIcon className={cn("h-5 w-5", 
                            task.status === 'Completed' ? 'text-green-500' :
                            task.status === 'In Progress' ? 'text-blue-500' :
                            task.status === 'Blocked' ? 'text-red-500' : 'text-gray-500'
                          )} />
                          <h4 className={cn(
                            "font-semibold text-gray-900 dark:text-white",
                            task.status === 'Completed' && "line-through text-gray-500"
                          )}>
                            {task.title}
                          </h4>
                          <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getStatusColor(task.status))}>
                            {task.status}
                          </span>
                          <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getPriorityColor(task.priority))}>
                            {task.priority}
                          </span>
                          {overdue && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <AlertCircle className="h-3 w-3" />
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {task.description}
                        </p>
                        {booking && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                            <strong>Booking:</strong> {booking.serviceType} • {new Date(booking.date).toLocaleDateString()}
                          </p>
                        )}
                        {task.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                            <strong>Notes:</strong> {task.notes}
                          </p>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {(task.estimatedHours || task.actualHours) && (
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {task.estimatedHours && (
                              <span className="flex items-center gap-1">
                                <Timer className="h-4 w-4" />
                                Est: {task.estimatedHours}h
                              </span>
                            )}
                            {task.actualHours && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Actual: {task.actualHours.toFixed(1)}h
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {trackingTaskId === task.id ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            stopTimeTracking()
                          }}
                          title="Stop tracking"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            startTimeTracking(task.id)
                          }}
                          title="Start time tracking"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkComplete(task.id)
                        }}
                        title="Mark complete"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateTask(task)
                        }}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingTask(task)
                          setShowTaskModal(true)
                        }}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTask(task.id)
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                    <span className={cn(
                      "flex items-center gap-1",
                      overdue && "text-red-600 dark:text-red-400 font-semibold"
                    )}>
                      <Calendar className="h-4 w-4" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span>
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            })}
            {filteredTasks.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No tasks found
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const prevMonth = new Date(calendarMonth)
                  prevMonth.setMonth(prevMonth.getMonth() - 1)
                  setCalendarMonth(prevMonth)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronUp className="h-5 w-5 rotate-[-90deg]" />
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => {
                  const nextMonth = new Date(calendarMonth)
                  nextMonth.setMonth(nextMonth.getMonth() + 1)
                  setCalendarMonth(nextMonth)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
              </button>
              <button
                onClick={() => setCalendarMonth(new Date())}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Today
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const year = calendarMonth.getFullYear()
              const month = calendarMonth.getMonth()
              const firstDay = new Date(year, month, 1)
              const startDate = new Date(firstDay)
              startDate.setDate(startDate.getDate() - startDate.getDay())
              
              const days: Date[] = []
              for (let i = 0; i < 42; i++) {
                const date = new Date(startDate)
                date.setDate(startDate.getDate() + i)
                days.push(date)
              }

              return days.map((date, idx) => {
                const isCurrentMonth = date.getMonth() === month
                const isToday = date.toDateString() === new Date().toDateString()
                const dayTasks = filteredTasks.filter(task => {
                  const taskDate = new Date(task.dueDate)
                  return taskDate.toDateString() === date.toDateString()
                })
                
                return (
                  <div
                    key={idx}
                    className={cn(
                      "min-h-[100px] p-2 rounded-lg border transition-colors",
                      isCurrentMonth 
                        ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" 
                        : "bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800",
                      isToday && "ring-2 ring-primary"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-semibold mb-1",
                      isCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600",
                      isToday && "text-primary"
                    )}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map(task => {
                        const overdue = isOverdue(task.dueDate) && task.status !== 'Completed'
                        return (
                          <div
                            key={task.id}
                            onClick={() => {
                              setEditingTask(task)
                              setShowTaskModal(true)
                            }}
                            className={cn(
                              "text-xs p-1 rounded cursor-pointer truncate",
                              task.status === 'Completed' 
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : overdue
                                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                                : task.status === 'In Progress'
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
                            )}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        )
                      })}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </motion.div>
      )}

      {/* Analytics View */}
      {activeView === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Status Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h3>
              <div className="space-y-4">
                {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
                  const percentage = tasks.length > 0 ? (statusTasks.length / tasks.length) * 100 : 0
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {statusTasks.length} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all",
                            status === 'Completed' ? 'bg-green-500' :
                            status === 'In Progress' ? 'bg-blue-500' :
                            status === 'Blocked' ? 'bg-red-500' : 'bg-gray-400'
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
              <div className="space-y-4">
                {['Urgent', 'High', 'Medium', 'Low'].map(priority => {
                  const priorityTasks = tasks.filter(t => t.priority === priority)
                  const percentage = tasks.length > 0 ? (priorityTasks.length / tasks.length) * 100 : 0
                  return (
                    <div key={priority}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("text-sm font-medium px-2 py-1 rounded-full", getPriorityColor(priority))}>
                          {priority}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {priorityTasks.length} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full transition-all", getPriorityColor(priority).split(' ')[0])}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Time Tracking Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time Tracking</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Estimated</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalEstimatedHours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Actual</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.totalActualHours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Difference</span>
                  <span className={cn(
                    "text-lg font-semibold",
                    stats.totalActualHours > stats.totalEstimatedHours 
                      ? "text-red-600 dark:text-red-400" 
                      : "text-green-600 dark:text-green-400"
                  )}>
                    {(stats.totalActualHours - stats.totalEstimatedHours).toFixed(1)}h
                  </span>
                </div>
                {stats.totalEstimatedHours > 0 && stats.totalActualHours > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {((stats.totalEstimatedHours / stats.totalActualHours) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((stats.totalEstimatedHours / stats.totalActualHours) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tag Usage */}
            {allTags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tag Usage</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => {
                    const tagCount = tasks.filter(t => t.tags?.includes(tag)).length
                    return (
                      <div
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30"
                      >
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-400">{tag}</span>
                        <span className="text-xs text-purple-600 dark:text-purple-300">{tagCount}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Completions</h3>
            <div className="space-y-3">
              {tasks
                .filter(t => t.status === 'Completed' && t.completedAt)
                .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Completed {new Date(task.completedAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {task.actualHours && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {task.actualHours.toFixed(1)}h
                      </span>
                    )}
                  </div>
                ))}
              {tasks.filter(t => t.status === 'Completed' && t.completedAt).length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No completed tasks yet</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <TaskModal
        isOpen={showTaskModal || !!editingTask}
        onClose={() => {
          setShowTaskModal(false)
          setEditingTask(null)
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  )
}

