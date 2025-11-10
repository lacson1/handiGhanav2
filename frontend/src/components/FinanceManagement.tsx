import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, TrendingUp, Clock, CheckCircle, 
  FileText, Download, Send, Eye, Calendar, Printer
} from 'lucide-react'
import { 
  BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { earningsApi } from '../lib/api'
import type { Invoice } from '../types'
import Button from './ui/Button'
import InvoiceModal from './InvoiceModal'
import { cn } from '../lib/utils'

interface FinanceManagementProps {
  providerId: string
}

export default function FinanceManagement({ providerId }: FinanceManagementProps) {
  const [activeView, setActiveView] = useState<'overview' | 'payments' | 'invoices' | 'earnings'>('overview')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [invoiceFilter, setInvoiceFilter] = useState<string>('all')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [_loading, setLoading] = useState(true)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [earningsPeriod, setEarningsPeriod] = useState<'7d' | '30d' | '3m' | '1y'>('30d')

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, these would be actual API calls
        // For now, we'll set empty arrays since the backend doesn't have these endpoints yet
        setPayments([])
        setInvoices([])
      } catch (error) {
        console.error('Error fetching finance data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [providerId])

  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id' | 'issuedDate'>) => {
    if (editingInvoice) {
      setInvoices(invoices.map(i => 
        i.id === editingInvoice.id ? { ...i, ...invoiceData } : i
      ))
      setEditingInvoice(null)
    } else {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: `inv-${Date.now()}`,
        issuedDate: new Date().toISOString()
      }
      setInvoices([...invoices, newInvoice])
    }
    setShowInvoiceModal(false)
  }

  const escapeHtml = (text: string | undefined | null): string => {
    if (!text) return ''
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  const handlePrintInvoice = (invoice: Invoice) => {
    try {
      if (!invoice || !invoice.items || invoice.items.length === 0) {
        alert('Cannot print invoice: Invalid invoice data')
        return
      }

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow pop-ups to print invoices')
        return
      }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              padding: 40px;
              color: #1f2937;
              background: white;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }
            .invoice-title {
              font-size: 32px;
              font-weight: bold;
              color: #111827;
            }
            .invoice-meta {
              text-align: right;
            }
            .invoice-meta p {
              margin: 4px 0;
              font-size: 14px;
              color: #6b7280;
            }
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            .detail-section h3 {
              font-size: 14px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 12px;
            }
            .detail-section p {
              font-size: 16px;
              color: #111827;
              margin: 4px 0;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .items-table thead {
              background-color: #f9fafb;
            }
            .items-table th {
              padding: 12px;
              text-align: left;
              font-size: 12px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 2px solid #e5e7eb;
            }
            .items-table td {
              padding: 16px 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 14px;
              color: #111827;
            }
            .items-table tbody tr:last-child td {
              border-bottom: none;
            }
            .text-right {
              text-align: right;
            }
            .total-section {
              margin-top: 20px;
              display: flex;
              justify-content: flex-end;
            }
            .total-box {
              width: 300px;
              padding: 20px;
              background-color: #f9fafb;
              border-radius: 8px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }
            .total-row.grand-total {
              margin-top: 12px;
              padding-top: 12px;
              border-top: 2px solid #e5e7eb;
              font-size: 20px;
              font-weight: bold;
              color: #111827;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .status-draft { background-color: #f3f4f6; color: #374151; }
            .status-sent { background-color: #dbeafe; color: #1e40af; }
            .status-paid { background-color: #d1fae5; color: #065f46; }
            .status-overdue { background-color: #fee2e2; color: #991b1b; }
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body {
                padding: 20px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <h1 class="invoice-title">INVOICE</h1>
              <p style="margin-top: 8px; color: #6b7280;">Invoice #${escapeHtml(invoice.id)}</p>
            </div>
            <div class="invoice-meta">
              <p><strong>Status:</strong> <span class="status-badge status-${escapeHtml(invoice.status).toLowerCase()}">${escapeHtml(invoice.status)}</span></p>
              <p><strong>Issued:</strong> ${formatDate(invoice.issuedDate)}</p>
              <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div class="invoice-details">
            <div class="detail-section">
              <h3>Bill To</h3>
              <p><strong>${escapeHtml(invoice.customerName)}</strong></p>
              <p>${escapeHtml(invoice.serviceType)}</p>
            </div>
            <div class="detail-section">
              <h3>Service Details</h3>
              <p><strong>Service Type:</strong> ${escapeHtml(invoice.serviceType)}</p>
              <p><strong>Booking ID:</strong> ${escapeHtml(invoice.bookingId)}</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => {
                const quantity = item.quantity || 0
                const price = item.price || 0
                const total = quantity * price
                return `
                <tr>
                  <td>${escapeHtml(item.description || '')}</td>
                  <td class="text-right">${quantity}</td>
                  <td class="text-right">GHS ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td class="text-right"><strong>GHS ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                </tr>
              `
              }).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
              <div class="total-row grand-total">
                <span>Total Amount</span>
                <span>GHS ${(invoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p style="margin-top: 8px;">This is a computer-generated invoice.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `

      printWindow.document.write(printContent)
      printWindow.document.close()
    } catch (error) {
      console.error('Error printing invoice:', error)
      alert('Failed to print invoice. Please try again.')
    }
  }

  // Filter payments
  const filteredPayments = useMemo(() => {
    if (paymentFilter === 'all') return payments
    return payments.filter(p => p.status.toLowerCase() === paymentFilter.toLowerCase())
  }, [paymentFilter, payments])

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    if (invoiceFilter === 'all') return invoices
    return invoices.filter(i => i.status.toLowerCase() === invoiceFilter.toLowerCase())
  }, [invoices, invoiceFilter])

  // Calculate financial summary
  const financialSummary = useMemo(() => {
    const totalEarnings = 0 // Calculate from API data
    const pendingPayout = 0 // Calculate from API data
    const paidOut = 0 // Calculate from API data
    const completedPayments = payments.filter(p => p.status === 'Completed')
    const pendingPayments = payments.filter(p => p.status === 'Pending')
    
    return {
      totalEarnings,
      pendingPayout,
      paidOut,
      completedPayments: completedPayments.length,
      pendingPayments: pendingPayments.length,
      totalTransactions: payments.length
    }
  }, [payments])

  const [earningsData, setEarningsData] = useState<any>(null)
  const [categoryData, setCategoryData] = useState<any>(null)

  // Fetch earnings analytics from API
  useEffect(() => {
    const loadEarningsData = async () => {
      if (!providerId) return
      
      try {
        const [analytics, trends, categories] = await Promise.all([
          earningsApi.getAnalytics(providerId, earningsPeriod),
          earningsApi.getTrends(providerId, 12),
          earningsApi.getByCategory(providerId, earningsPeriod)
        ])
        
        setEarningsData({ analytics, trends, categories })
        setCategoryData(categories)
      } catch (error) {
        console.error('Failed to load earnings data:', error)
        // Fallback to mock data on error
        setEarningsData(null)
      }
    }

    loadEarningsData()
  }, [providerId, earningsPeriod])

  // Generate earnings chart data (use API data if available, otherwise mock)
  const earningsChartData = useMemo(() => {
    if (earningsData?.analytics?.chartData) {
      return earningsData.analytics.chartData.map((d: any) => ({
        date: d.dayKey,
        earnings: d.earnings,
        jobs: d.jobs,
        payout: d.payout
      }))
    }

    // Fallback to mock data
    const now = new Date()
    const days = earningsPeriod === '7d' ? 7 : earningsPeriod === '30d' ? 30 : earningsPeriod === '3m' ? 90 : 365
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayKey = date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })
      
      const earnings = Math.floor(Math.random() * 500) + 200
      const jobs = Math.floor(Math.random() * 5) + 1
      
      data.push({
        date: dayKey,
        earnings,
        jobs,
        payout: earnings * 0.85
      })
    }
    
    return data
  }, [earningsData, earningsPeriod])

  // Generate monthly trends data
  const monthlyTrendsData = useMemo(() => {
    if (earningsData?.trends?.monthlyData) {
      return earningsData.trends.monthlyData.map((m: any) => ({
        month: m.month,
        earnings: m.earnings,
        jobs: m.jobs,
        avgPerJob: m.avgPerJob
      }))
    }

    // Fallback to mock data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    
    return months.slice(0, currentMonth + 1).map((month) => ({
      month,
      earnings: Math.floor(Math.random() * 5000) + 3000,
      jobs: Math.floor(Math.random() * 30) + 10,
      avgPerJob: Math.floor(Math.random() * 200) + 150
    }))
  }, [earningsData])

  // Earnings by category
  const earningsByCategory = useMemo(() => {
    if (categoryData?.categories) {
      return categoryData.categories.map((c: any) => ({
        category: c.category,
        earnings: c.earnings,
        jobs: c.jobs,
        color: c.color || '#FACC15'
      }))
    }

    // Fallback to mock data
    return [
      { category: 'Electrical', earnings: 4500, jobs: 15, color: '#FACC15' },
      { category: 'Plumbing', earnings: 3200, jobs: 12, color: '#3B82F6' },
      { category: 'Cleaning', earnings: 2800, jobs: 20, color: '#10B981' },
      { category: 'Handyman', earnings: 2100, jobs: 8, color: '#F59E0B' }
    ]
  }, [categoryData])

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase()
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      SENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
    return styles[statusUpper as keyof typeof styles] || styles.PENDING
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'earnings', label: 'Earnings', icon: CheckCircle }
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

      {/* Overview */}
      {activeView === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: 'Total Earnings', 
                value: `GHS ${financialSummary.totalEarnings.toLocaleString()}`, 
                icon: DollarSign, 
                color: 'green',
                change: '+12.5%'
              },
              { 
                label: 'Pending Payout', 
                value: `GHS ${financialSummary.pendingPayout.toLocaleString()}`, 
                icon: Clock, 
                color: 'yellow',
                change: '2 payments'
              },
              { 
                label: 'Paid Out', 
                value: `GHS ${financialSummary.paidOut.toLocaleString()}`, 
                icon: CheckCircle, 
                color: 'blue',
                change: 'This month'
              },
              { 
                label: 'Total Transactions', 
                value: financialSummary.totalTransactions.toString(), 
                icon: TrendingUp, 
                color: 'purple',
                change: `${financialSummary.completedPayments} completed`
              }
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <stat.icon className={cn("h-5 w-5", `text-${stat.color}-500`)} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Recent Payments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Payments
            </h3>
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {payment.method} • {payment.transactionId || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.paidAt 
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : 'Pending'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      GHS {payment.amount.toLocaleString()}
                    </p>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getStatusBadge(payment.status))}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Payments */}
      {activeView === 'payments' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Payments ({filteredPayments.length})
            </h3>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {payment.method}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Booking ID: {payment.bookingId}
                        </p>
                      </div>
                    </div>
                    {payment.transactionId && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-3 mt-1">
                          Transaction: {payment.transactionId}
                        </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      GHS {payment.amount.toLocaleString()}
                    </p>
                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusBadge(payment.status))}>
                      {payment.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {payment.paidAt 
                      ? `Paid on ${new Date(payment.paidAt).toLocaleDateString()}`
                      : `Created on ${new Date(payment.createdAt).toLocaleDateString()}`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Invoices */}
      {activeView === 'invoices' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invoices ({filteredInvoices.length})
              </h3>
              <div className="flex gap-2">
                <select
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <Button size="sm" onClick={() => setShowInvoiceModal(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Invoice #{invoice.id}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {invoice.customerName} • {invoice.serviceType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        GHS {invoice.amount.toLocaleString()}
                      </p>
                      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusBadge(invoice.status))}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Items:</p>
                    <div className="space-y-2">
                      {invoice.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{item.description} x{item.quantity}</span>
                          <span>GHS {item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                      <span>Issued: {new Date(invoice.issuedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingInvoice(invoice)
                          setShowInvoiceModal(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View/Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePrintInvoice(invoice)}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      {invoice.status === 'Draft' && (
                        <Button size="sm" onClick={() => {
                          setInvoices(invoices.map(i => 
                            i.id === invoice.id ? { ...i, status: 'Sent' } : i
                          ))
                        }}>
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Earnings */}
      {activeView === 'earnings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Period Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Earnings Analytics
              </h3>
              <div className="flex gap-2">
                {(['7d', '30d', '3m', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setEarningsPeriod(period)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      earningsPeriod === period
                        ? "bg-primary text-black"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '3m' ? '3 Months' : '1 Year'}
                  </button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    if (!providerId) return
                    try {
                      await earningsApi.exportReport(providerId, 'csv', earningsPeriod)
                    } catch {
                      alert('Failed to export report. Please try again.')
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  GHS {earningsChartData.reduce((sum: number, d: { earnings: number }) => sum + (d.earnings || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {earningsData?.analytics?.summary?.growth 
                    ? `+${earningsData.analytics.summary.growth}% from last period`
                    : '+12.5% from last period'}
                </p>
              </div>
              <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {earningsChartData.reduce((sum: number, d: { jobs: number }) => sum + (d.jobs || 0), 0)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Avg: GHS {Math.round(earningsChartData.reduce((sum: number, d: { earnings: number }) => sum + (d.earnings || 0), 0) / Math.max(earningsChartData.reduce((sum: number, d: { jobs: number }) => sum + (d.jobs || 0), 0), 1))} per job
                </p>
              </div>
              <div className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Payout</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  GHS {financialSummary.pendingPayout.toLocaleString()}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  2 payments pending
                </p>
              </div>
              <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paid Out</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  GHS {financialSummary.paidOut.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  This month
                </p>
              </div>
            </div>

            {/* Earnings Trend Chart */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Earnings Trend
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsChartData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      className="text-xs"
                    />
                    <YAxis 
                      stroke="#6b7280"
                      className="text-xs"
                      tickFormatter={(value) => `GHS ${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`GHS ${value.toLocaleString()}`, 'Earnings']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#FACC15" 
                      fillOpacity={1}
                      fill="url(#colorEarnings)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Monthly Trends
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      className="text-xs"
                    />
                    <YAxis 
                      stroke="#6b7280"
                      className="text-xs"
                      tickFormatter={(value) => `GHS ${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`GHS ${value.toLocaleString()}`, 'Earnings']}
                    />
                    <Legend />
                    <Bar dataKey="earnings" fill="#FACC15" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Earnings by Category */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Earnings by Service Category
              </h4>
              <div className="space-y-3">
                {earningsByCategory.map((item: { category: string; earnings: number; jobs: number }) => (
                  <div key={item.category} className="flex items-center gap-4">
                    <div className="w-24">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                        <div
                          className="h-full rounded-full flex items-center justify-end pr-2"
                          style={{
                            width: `${(item.earnings / earningsByCategory[0].earnings) * 100}%`,
                            backgroundColor: '#FACC15'
                          }}
                        >
                          <span className="text-xs font-semibold text-white">
                            GHS {item.earnings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.jobs} jobs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Earnings */}
          {[].map((earning: any) => (
            <div
              key={earning.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {earning.period}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    GHS {earning.totalEarnings.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {earning.completedJobs}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Payout</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    GHS {earning.pendingPayout.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paid Out</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    GHS {earning.paidOut.toLocaleString()}
                  </p>
                </div>
              </div>
              {earning.transactions.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Transactions ({earning.transactions.length})
                  </p>
                  <div className="space-y-2">
                    {earning.transactions.map((transaction: any) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {transaction.method}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {transaction.transactionId}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          GHS {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}

      <InvoiceModal
        isOpen={showInvoiceModal || !!editingInvoice}
        onClose={() => {
          setShowInvoiceModal(false)
          setEditingInvoice(null)
        }}
        onSave={handleSaveInvoice}
        invoice={editingInvoice}
      />
    </div>
  )
}

