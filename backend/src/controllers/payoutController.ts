import { Request, Response } from 'express'

// Mock payout/wallet data
interface Payout {
  id: string
  providerId: string
  amount: number
  method: 'MOBILE_MONEY_MTN' | 'MOBILE_MONEY_VODAFONE' | 'MOBILE_MONEY_AIRTELTIGO' | 'BANK_TRANSFER'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  recipientNumber?: string
  bankAccount?: string
  transactionId?: string
  createdAt: string
  completedAt?: string
}

interface Wallet {
  providerId: string
  balance: number
  pendingBalance: number
  totalEarned: number
  totalWithdrawn: number
  lastUpdated: string
}

const mockPayouts: Payout[] = []
const mockWallets: Map<string, Wallet> = new Map()

// Initialize wallet for provider
const getOrCreateWallet = (providerId: string): Wallet => {
  if (!mockWallets.has(providerId)) {
    mockWallets.set(providerId, {
      providerId,
      balance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      lastUpdated: new Date().toISOString()
    })
  }
  return mockWallets.get(providerId)!
}

// Get wallet balance
export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    const wallet = getOrCreateWallet(id)

    res.json({
      wallet,
      recentPayouts: mockPayouts
        .filter(p => p.providerId === id)
        .slice(0, 10)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch wallet balance' })
  }
}

// Request payout
export const requestPayout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { amount, method, recipientNumber, bankAccount } = req.body

    if (!id) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' })
    }

    if (!method) {
      return res.status(400).json({ message: 'Payout method is required' })
    }

    const wallet = getOrCreateWallet(id)

    // Check if sufficient balance
    if (wallet.balance < amount) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        availableBalance: wallet.balance
      })
    }

    // Validate method-specific requirements
    if (method.startsWith('MOBILE_MONEY_') && !recipientNumber) {
      return res.status(400).json({ message: 'Recipient phone number is required for mobile money' })
    }

    if (method === 'BANK_TRANSFER' && !bankAccount) {
      return res.status(400).json({ message: 'Bank account details are required for bank transfer' })
    }

    // Create payout request
    const payout: Payout = {
      id: `payout-${Date.now()}`,
      providerId: id,
      amount: Number(amount),
      method: method as Payout['method'],
      status: 'PENDING',
      recipientNumber,
      bankAccount,
      createdAt: new Date().toISOString()
    }

    mockPayouts.push(payout)

    // Deduct from wallet balance (move to pending)
    wallet.balance -= amount
    wallet.pendingBalance += amount
    wallet.lastUpdated = new Date().toISOString()

    // In production, process payout asynchronously
    // For now, simulate processing
    setTimeout(() => {
      const payoutIndex = mockPayouts.findIndex(p => p.id === payout.id)
      if (payoutIndex !== -1) {
        mockPayouts[payoutIndex].status = 'PROCESSING'
        
        // Simulate completion after 2 seconds
        setTimeout(() => {
          if (payoutIndex !== -1 && mockPayouts[payoutIndex]) {
            mockPayouts[payoutIndex].status = 'COMPLETED'
            mockPayouts[payoutIndex].completedAt = new Date().toISOString()
            mockPayouts[payoutIndex].transactionId = `TXN-${Date.now()}`
            
            // Update wallet
            wallet.pendingBalance -= amount
            wallet.totalWithdrawn += amount
            wallet.lastUpdated = new Date().toISOString()
          }
        }, 2000)
      }
    }, 1000)

    res.status(201).json({
      message: 'Payout request created successfully',
      payout,
      wallet
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create payout request' })
  }
}

// Get payout history
export const getPayoutHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, limit = 50, offset = 0 } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    let payouts = mockPayouts.filter(p => p.providerId === id)

    // Filter by status if provided
    if (status) {
      payouts = payouts.filter(p => p.status.toLowerCase() === (status as string).toLowerCase())
    }

    // Sort by newest first
    payouts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const limitNum = Number(limit)
    const offsetNum = Number(offset)
    const paginated = payouts.slice(offsetNum, offsetNum + limitNum)

    res.json({
      payouts: paginated,
      total: payouts.length,
      limit: limitNum,
      offset: offsetNum
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch payout history' })
  }
}

// Add earnings to wallet (called when payment is completed)
export const addEarnings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { amount, bookingId, commissionRate = 0.15 } = req.body

    if (!id || !amount) {
      return res.status(400).json({ message: 'Provider ID and amount are required' })
    }

    const wallet = getOrCreateWallet(id)
    const providerEarnings = amount * (1 - commissionRate) // After platform commission

    wallet.balance += providerEarnings
    wallet.totalEarned += providerEarnings
    wallet.lastUpdated = new Date().toISOString()

    res.json({
      message: 'Earnings added to wallet',
      amount: providerEarnings,
      commission: amount * commissionRate,
      wallet
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to add earnings' })
  }
}

