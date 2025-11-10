import { Router } from 'express'
import { getPlatformStats, getRecentReviews } from '../controllers/statsController'

const router = Router()

router.get('/platform', getPlatformStats)
router.get('/reviews/recent', getRecentReviews)

export default router

