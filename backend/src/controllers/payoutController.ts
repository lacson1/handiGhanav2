import { Request, Response } from 'express'
import { Payout, Wallet, PayoutMethod, PayoutStatus } from '../types/controller.types'

const mockPayouts: Payout[] = []
const mockWallets: Map<string, Wallet> = new Map()

// Process payout asynchronously (in production, use a job queue like Bull)
const processPayout = async (payoutId: string, amount: number, wallet: Wallet): Promise<void> => {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const payoutIndex = mockPayouts.findIndex(p => p.id === payoutId)
    if (payoutIndex === -1) return
    
    mockPayouts[payoutIndex].status = 'PROCESSING'
    
    // Simulate completion after additional delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const currentPayoutIndex = mockPayouts.findIndex(p => p.id === payoutId)
    if (currentPayoutIndex !== -1 && mockPayouts[currentPayoutIndex]) {
      mockPayouts[currentPayoutIndex].status = 'COMPLETED'
      mockPayouts[currentPayoutIndex].completedAt = new Date().toISOString()
      mockPayouts[currentPayoutIndex].transactionId = `TXN-${Date.now()}`
      
      // Update wallet
      wallet.pendingBalance -= amount
      wallet.totalWithdrawn += amount
      wallet.lastUpdated = new Date().toISOString()
    }
  } catch (error) {
    console.error('Payout processing error:', error)
    const payoutIndex = mockPayouts.findIndex(p => p.id === payoutId)
    if (payoutIndex !== -1) {
      mockPayouts[payoutIndex].status = 'FAILED'
    }
  }
}

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallet balance'
    console.error('Get wallet balance error:', error)
    res.status(500).json({ message: errorMessage })
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

    const amountNum = Number(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: 'Valid amount is required and must be greater than 0' })
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
      amount: amountNum,
      method: method as PayoutMethod,
      status: 'PENDING',
      recipientNumber,
      bankAccount,
      createdAt: new Date().toISOString()
    }

    mockPayouts.push(payout)

    // Deduct from wallet balance (move to pending)
    wallet.balance -= amountNum
    wallet.pendingBalance += amountNum
    wallet.lastUpdated = new Date().toISOString()

    // Process payout asynchronously (don't await - fire and forget)
    // In production, use a proper job queue (Bull, BullMQ, etc.)
    processPayout(payout.id, amountNum, wallet).catch(error => {
      console.error('Failed to process payout:', error)
    })

    res.status(201).json({
      message: 'Payout request created successfully',
      payout,
      wallet
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create payout request'
    console.error('Request payout error:', error)
    res.status(500).json({ message: errorMessage })
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payout history'
    console.error('Get payout history error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

// Add earnings to wallet (called when payment is completed)
export const addEarnings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { amount, bookingId, commissionRate = 0.15 } = req.body

    if (!id) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    const amountNum = Number(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: 'Valid amount is required and must be greater than 0' })
    }

    const commissionRateNum = Number(commissionRate)
    if (isNaN(commissionRateNum) || commissionRateNum < 0 || commissionRateNum > 1) {
      return res.status(400).json({ message: 'Commission rate must be between 0 and 1' })
    }

    const wallet = getOrCreateWallet(id)
    const providerEarnings = amountNum * (1 - commissionRateNum) // After platform commission

    wallet.balance += providerEarnings
    wallet.totalEarned += providerEarnings
    wallet.lastUpdated = new Date().toISOString()

    res.json({
      message: 'Earnings added to wallet',
      amount: providerEarnings,
      commission: amountNum * commissionRateNum,
      wallet
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add earnings'
    console.error('Add earnings error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

