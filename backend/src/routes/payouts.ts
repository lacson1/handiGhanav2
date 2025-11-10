import express from 'express'
import { 
  getWalletBalance, 
  requestPayout, 
  getPayoutHistory,
  addEarnings
} from '../controllers/payoutController'

const router = express.Router()

// GET /api/payouts/:id/wallet - Get wallet balance
router.get('/:id/wallet', getWalletBalance)

// POST /api/payouts/:id/request - Request payout
router.post('/:id/request', requestPayout)

// GET /api/payouts/:id/history - Get payout history
router.get('/:id/history', getPayoutHistory)

// POST /api/payouts/:id/earnings - Add earnings to wallet (internal use)
router.post('/:id/earnings', addEarnings)

export default router

