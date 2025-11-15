import express from 'express'
import multer from 'multer'
import { uploadImage } from '../controllers/uploadController'
import { uploadRateLimit } from '../middleware/rateLimit'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// POST /api/upload/image - Upload image to Cloudinary
router.post('/image', uploadRateLimit, upload.single('file'), uploadImage)

export default router

