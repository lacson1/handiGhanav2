import { Router } from 'express'
import { getPlatformStats, getRecentReviews, getTrendingSearches, trackSearch } from '../controllers/statsController'

const router = Router()

router.get('/platform', getPlatformStats)
router.get('/reviews/recent', getRecentReviews)
router.get('/trending-searches', getTrendingSearches)
router.post('/track-search', trackSearch)

export default router

