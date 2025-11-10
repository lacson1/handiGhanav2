import express from 'express'
import multer from 'multer'
import { uploadImage } from '../controllers/uploadController'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// POST /api/upload/image - Upload image to Cloudinary
router.post('/image', upload.single('file'), uploadImage)

export default router

