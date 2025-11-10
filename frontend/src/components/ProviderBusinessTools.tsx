import { useState } from 'react'
import { FileText, Calculator, Clock, TrendingUp, Download, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from './ui/Button'

interface Invoice {
  id: string
  customerName: string
  serviceType: string
  amount: number
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue'
  dueDate: string
  issuedDate: string
}

interface TimeEntry {
  id: string
  bookingId: string
  date: string
  startTime: string
  endTime: string
  duration: number // in minutes
  description: string
}

export default function ProviderBusinessTools() {
  const [activeTab, setActiveTab] = useState<'invoicing' | 'tax' | 'time' | 'insights'>('invoicing')
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv-001',
      customerName: 'John Doe',
      serviceType: 'Electrical Repair',
      amount: 250,
      status: 'Paid',
      dueDate: '2024-01-25',
      issuedDate: '2024-01-20'
    },
    {
      id: 'inv-002',
      customerName: 'Jane Smith',
      serviceType: 'Plumbing',
      amount: 180,
      status: 'Sent',
      dueDate: '2024-01-30',
      issuedDate: '2024-01-22'
    }
  ])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [taxInfo, setTaxInfo] = useState({
    taxId: '',
    taxRate: 12.5, // VAT rate in Ghana
    monthlyEarnings: 0,
    estimatedTax: 0
  })

  const calculateTax = () => {
    const taxableAmount = taxInfo.monthlyEarnings
    const vat = taxableAmount * (taxInfo.taxRate / 100)
    setTaxInfo({ ...taxInfo, estimatedTax: vat })
  }

  const generateInvoice = () => {
    // TODO: Open invoice creation modal
    alert('Invoice generation feature coming soon!')
  }

  const downloadInvoice = (invoiceId: string) => {
    // TODO: Generate and download PDF
    alert(`Downloading invoice ${invoiceId}...`)
  }

  const tabs = [
    { id: 'invoicing' as const, label: 'Invoicing', icon: FileText },
    { id: 'tax' as const, label: 'Tax Calculator', icon: Calculator },
    { id: 'time' as const, label: 'Time Tracking', icon: Clock },
    { id: 'insights' as const, label: 'Insights', icon: TrendingUp }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Business Tools
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your business finances and track your work
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'invoicing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Invoices
            </h3>
            <Button onClick={generateInvoice} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {invoice.customerName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {invoice.serviceType}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'Paid'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : invoice.status === 'Sent'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : invoice.status === 'Overdue'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Amount: <span className="font-semibold text-gray-900 dark:text-white">GHS {invoice.amount}</span></p>
                    <p>Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Tax ID (TIN)
            </label>
            <input
              type="text"
              value={taxInfo.taxId}
              onChange={(e) => setTaxInfo({ ...taxInfo, taxId: e.target.value })}
              placeholder="Enter your Tax Identification Number"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Monthly Earnings (GHS)
            </label>
            <input
              type="number"
              value={taxInfo.monthlyEarnings}
              onChange={(e) => {
                const earnings = parseFloat(e.target.value) || 0
                setTaxInfo({ ...taxInfo, monthlyEarnings: earnings })
                calculateTax()
              }}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">VAT Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">{taxInfo.taxRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated VAT</span>
              <span className="text-xl font-bold text-primary">GHS {taxInfo.estimatedTax.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              * This is an estimate. Consult a tax professional for accurate calculations.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'time' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Time Entries
            </h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
          {timeEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No time entries yet</p>
              <p className="text-sm mt-1">Start tracking your work hours</p>
            </div>
          ) : (
            <div className="space-y-3">
              {timeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {entry.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.startTime} - {entry.endTime} ({entry.duration} min)
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">GHS 0</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0h</p>
            </div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Insights</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Average booking value: GHS 0</li>
              <li>• Most popular service: N/A</li>
              <li>• Peak booking times: N/A</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

