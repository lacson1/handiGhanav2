import { useState, useEffect } from 'react'
import { X, Plus, Trash2, DollarSign, Calendar, Printer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Invoice, InvoiceItem } from '../types'
// Mock data removed
import Button from './ui/Button'
import { cn } from '../lib/utils'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (invoice: Omit<Invoice, 'id' | 'issuedDate'>) => void
  invoice?: Invoice | null
}

export default function InvoiceModal({ isOpen, onClose, onSave, invoice }: InvoiceModalProps) {
  const [formData, setFormData] = useState({
    bookingId: '',
    customerName: '',
    serviceType: '',
    status: 'Draft' as Invoice['status'],
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }] as InvoiceItem[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (invoice) {
      setFormData({
        bookingId: invoice.bookingId,
        customerName: invoice.customerName,
        serviceType: invoice.serviceType,
        status: invoice.status,
        dueDate: invoice.dueDate.split('T')[0],
        items: invoice.items.length > 0 ? invoice.items : [{ description: '', quantity: 1, price: 0 }]
      })
    } else {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      setFormData({
        bookingId: '',
        customerName: '',
        serviceType: '',
        status: 'Draft',
        dueDate: nextWeek.toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, price: 0 }]
      })
    }
    setErrors({})
  }, [invoice, isOpen])

  useEffect(() => {
    if (formData.bookingId) {
      const booking = null // TODO: Fetch from bookingsApi.getById(formData.bookingId)
      if (booking) {
        const customer: any = null // TODO: Fetch from usersApi.getById(booking.userId)
        setFormData(prev => ({
          ...prev,
          customerName: customer?.name || '',
          serviceType: (booking as any)?.serviceType || ''
        }))
      }
    }
  }, [formData.bookingId])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.bookingId) {
      newErrors.bookingId = 'Please select a booking'
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }
    if (formData.items.length === 0 || formData.items.some(item => !item.description.trim())) {
      newErrors.items = 'At least one item with description is required'
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      const totalAmount = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      onSave({
        ...formData,
        amount: totalAmount,
        dueDate: new Date(formData.dueDate).toISOString(),
        items: formData.items.filter(item => item.description.trim())
      })
      onClose()
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }]
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

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

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow pop-ups to print invoices')
        return
      }

      const invoiceData = invoice || {
        id: `INV-${Date.now()}`,
        bookingId: formData.bookingId || '',
        customerName: formData.customerName || '',
        serviceType: formData.serviceType || '',
        amount: totalAmount || 0,
        status: formData.status || 'Draft',
        dueDate: formData.dueDate || new Date().toISOString(),
        issuedDate: new Date().toISOString(),
        items: formData.items.filter(item => item.description && item.description.trim())
      }

      if (!invoiceData.items || invoiceData.items.length === 0) {
        alert('Cannot print invoice: No items found')
        return
      }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.id}</title>
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
              <p style="margin-top: 8px; color: #6b7280;">Invoice #${escapeHtml(invoiceData.id)}</p>
            </div>
            <div class="invoice-meta">
              <p><strong>Status:</strong> <span class="status-badge status-${escapeHtml(invoiceData.status).toLowerCase()}">${escapeHtml(invoiceData.status)}</span></p>
              <p><strong>Issued:</strong> ${formatDate(invoiceData.issuedDate)}</p>
              <p><strong>Due Date:</strong> ${formatDate(invoiceData.dueDate)}</p>
            </div>
          </div>

          <div class="invoice-details">
            <div class="detail-section">
              <h3>Bill To</h3>
              <p><strong>${escapeHtml(invoiceData.customerName)}</strong></p>
              <p>${escapeHtml(invoiceData.serviceType)}</p>
            </div>
            <div class="detail-section">
              <h3>Service Details</h3>
              <p><strong>Service Type:</strong> ${escapeHtml(invoiceData.serviceType)}</p>
              <p><strong>Booking ID:</strong> ${escapeHtml(invoiceData.bookingId)}</p>
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
              ${invoiceData.items.map(item => {
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
                <span>GHS ${(invoiceData.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h2>
                <div className="flex items-center gap-2">
                  {invoice && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      title="Print Invoice"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Booking *
                    </label>
                    <select
                      value={formData.bookingId}
                      onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                      className={cn(
                        "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary",
                        errors.bookingId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                    >
                      <option value="">Select a booking</option>
                      {[].map((booking: any) => (
                        <option key={booking.id} value={booking.id}>
                          {booking.serviceType} - {new Date(booking.date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                    {errors.bookingId && <p className="text-sm text-red-500 mt-1">{errors.bookingId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className={cn(
                        "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary",
                        errors.customerName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                      readOnly={!!formData.bookingId}
                    />
                    {errors.customerName && <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Service Type
                    </label>
                    <input
                      type="text"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      readOnly={!!formData.bookingId}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary",
                      errors.dueDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    )}
                  />
                  {errors.dueDate && <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Invoice Items *
                    </label>
                    <Button type="button" size="sm" variant="outline" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  {errors.items && <p className="text-sm text-red-500 mb-2">{errors.items}</p>}
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Item description"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Qty"
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Price"
                          />
                        </div>
                        <div className="w-24 flex items-center justify-end">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            GHS {(item.quantity * item.price).toLocaleString()}
                          </span>
                        </div>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      <DollarSign className="h-5 w-5 inline mr-1" />
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      GHS {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button type="submit" className="flex-1">
                    {invoice ? 'Update Invoice' : 'Create Invoice'}
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

