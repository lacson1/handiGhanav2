import { useState, useEffect } from 'react'
import { X, CreditCard, CheckCircle, Smartphone, Building2, Wallet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { paymentsApi } from '../lib/api'
import Button from './ui/Button'

type PaymentMethod = 'card' | 'mobile_money' | 'bank_transfer' | 'wallet'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  amount: number
  onSuccess: () => void
  discount?: number // First booking discount or referral discount
}

export default function PaymentModal({ isOpen, onClose, bookingId, amount, onSuccess, discount = 0 }: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'form' | 'processing' | 'success'>('method')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    mobileMoneyProvider: 'MTN' as 'MTN' | 'VODAFONE' | 'AIRTELTIGO',
    mobileMoneyNumber: '',
    bankAccount: ''
  })
  
  const finalAmount = Math.max(0, amount - discount)

  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('processing')

    try {
      const paymentPayload: Record<string, any> = {
        bookingId,
        amount: finalAmount,
        method: paymentMethod === 'card' ? 'CARD' : 
                paymentMethod === 'mobile_money' ? `MOBILE_MONEY_${paymentData.mobileMoneyProvider}` :
                paymentMethod === 'bank_transfer' ? 'BANK_TRANSFER' : 'WALLET'
      }

      if (paymentMethod === 'mobile_money') {
        paymentPayload.mobileMoneyNumber = paymentData.mobileMoneyNumber
        paymentPayload.mobileMoneyProvider = paymentData.mobileMoneyProvider
      } else if (paymentMethod === 'bank_transfer') {
        paymentPayload.bankAccount = paymentData.bankAccount
      }

      await paymentsApi.initialize(bookingId, finalAmount, paymentPayload)
      
      // In production, redirect to Paystack payment page or process mobile money
      // For demo, simulate success
      setTimeout(() => {
        setStep('success')
        setTimeout(() => {
          onSuccess()
          onClose()
          setStep('method')
        }, 2000)
      }, 2000)
    } catch {
      alert('Payment failed. Please try again.')
      setStep('form')
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setStep('method')
      setPaymentMethod('card')
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        mobileMoneyProvider: 'MTN',
        mobileMoneyNumber: '',
        bankAccount: ''
      })
    }
  }, [isOpen])

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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {step === 'method' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Choose Payment Method
                    </h2>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                    <div className="flex items-baseline gap-2">
                      {discount > 0 && (
                        <span className="text-lg line-through text-gray-400">
                          GHS {amount.toLocaleString()}
                        </span>
                      )}
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        GHS {finalAmount.toLocaleString()}
                      </p>
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        🎉 You saved GHS {discount.toLocaleString()}!
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleMethodSelect('card')}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <CreditCard className="h-6 w-6 text-primary mb-2" />
                      <p className="font-semibold text-gray-900 dark:text-white">Card</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Visa, Mastercard</p>
                    </button>
                    <button
                      onClick={() => handleMethodSelect('mobile_money')}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <Smartphone className="h-6 w-6 text-primary mb-2" />
                      <p className="font-semibold text-gray-900 dark:text-white">Mobile Money</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">MTN, Vodafone, AirtelTigo</p>
                    </button>
                    <button
                      onClick={() => handleMethodSelect('bank_transfer')}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <Building2 className="h-6 w-6 text-primary mb-2" />
                      <p className="font-semibold text-gray-900 dark:text-white">Bank Transfer</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Direct bank transfer</p>
                    </button>
                    <button
                      onClick={() => handleMethodSelect('wallet')}
                      className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <Wallet className="h-6 w-6 text-primary mb-2" />
                      <p className="font-semibold text-gray-900 dark:text-white">Wallet</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Handighana wallet</p>
                    </button>
                  </div>
                </div>
              )}

              {step === 'form' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Complete Payment
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {paymentMethod === 'card' && 'Card Payment'}
                        {paymentMethod === 'mobile_money' && 'Mobile Money Payment'}
                        {paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                        {paymentMethod === 'wallet' && 'Wallet Payment'}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep('method')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                    <div className="flex items-baseline gap-2">
                      {discount > 0 && (
                        <span className="text-lg line-through text-gray-400">
                          GHS {amount.toLocaleString()}
                        </span>
                      )}
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        GHS {finalAmount.toLocaleString()}
                      </p>
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        🎉 You saved GHS {discount.toLocaleString()}!
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {paymentMethod === 'card' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Card Number
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={paymentData.cardNumber}
                              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              required
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={paymentData.expiryDate}
                              onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                              placeholder="MM/YY"
                              maxLength={5}
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={paymentData.cvv}
                              onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                              placeholder="123"
                              maxLength={3}
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={paymentData.cardName}
                            onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </>
                    )}

                    {paymentMethod === 'mobile_money' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Mobile Money Provider
                          </label>
                          <select
                            value={paymentData.mobileMoneyProvider}
                            onChange={(e) => setPaymentData({ ...paymentData, mobileMoneyProvider: e.target.value as any })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            <option value="MTN">MTN Mobile Money</option>
                            <option value="VODAFONE">Vodafone Cash</option>
                            <option value="AIRTELTIGO">AirtelTigo Money</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Mobile Money Number
                          </label>
                          <input
                            type="tel"
                            value={paymentData.mobileMoneyNumber}
                            onChange={(e) => setPaymentData({ ...paymentData, mobileMoneyNumber: e.target.value })}
                            placeholder="0244 123 456"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            You'll receive a prompt on your phone to confirm the payment
                          </p>
                        </div>
                      </>
                    )}

                    {paymentMethod === 'bank_transfer' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Bank Account Number
                        </label>
                        <input
                          type="text"
                          value={paymentData.bankAccount}
                          onChange={(e) => setPaymentData({ ...paymentData, bankAccount: e.target.value })}
                          placeholder="Account number"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Bank details will be sent to your email after booking confirmation
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'wallet' && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          You'll pay from your Handighana wallet balance. If you don't have sufficient balance, you'll be redirected to top up.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('method')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                      >
                        Pay GHS {finalAmount.toLocaleString()}
                      </Button>
                    </div>
                  </form>

                  <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    🔒 Secure payment powered by Paystack
                    {paymentMethod === 'mobile_money' && ' & Mobile Money providers'}
                  </p>
                </div>
              )}

              {step === 'processing' && (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Processing payment...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your booking has been confirmed.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

