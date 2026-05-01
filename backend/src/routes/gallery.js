import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { requireAuth } from '../middleware/jwt.js'
import { GalleryImage } from '../db/models/galleryImage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const galleryUploadsDirectory = path.resolve(__dirname, '../../uploads/gallery')

if (!fs.existsSync(galleryUploadsDirectory)) {
  fs.mkdirSync(galleryUploadsDirectory, { recursive: true })
}

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])

const extensionByMimeType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}

const upload = multer({
  storage: multer.diskStorage({
    destination: galleryUploadsDirectory,
    filename: (req, file, callback) => {
      const extension =
        extensionByMimeType[file.mimetype] ||
        path.extname(file.originalname) ||
        '.img'
      callback(
        null,
        `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`,
      )
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new Error('Only JPG, PNG, GIF, and WEBP image files are allowed'),
      )
    }
    callback(null, true)
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

function uploadGalleryImageMiddleware(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (!err) {
      next()
      return
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'Image file must be 5MB or smaller' })
        return
      }
      res.status(400).json({ error: err.message })
      return
    }

    if (
      err.message === 'Only JPG, PNG, GIF, and WEBP image files are allowed'
    ) {
      res.status(400).json({ error: err.message })
      return
    }

    console.error('Error uploading gallery image:', err)
    res.status(500).end()
  })
}

function mapGalleryImage(image) {
  return {
    id: image._id.toString(),
    url: image.url,
    filename: image.filename,
    mimeType: image.mimeType,
    size: image.size,
    uploadedBy: image.uploadedBy?.toString(),
    createdAt: image.createdAt,
    updatedAt: image.updatedAt,
  }
}

export function galleryRoutes(app) {
  app.post(
    '/api/v1/gallery/images',
    requireAuth,
    uploadGalleryImageMiddleware,
    async (req, res) => {
      try {
        const userId = req.auth?.sub || req.auth?.userId
        if (!userId) {
          return res.status(401).json({ error: 'Authentication is required' })
        }
        if (!req.file) {
          return res.status(400).json({ error: 'Image file is required' })
        }

        const imageUrl = `${req.protocol}://${req.get(
          'host',
        )}/uploads/gallery/${req.file.filename}`
        const image = await GalleryImage.create({
          url: imageUrl,
          filename: req.file.filename,
          mimeType: req.file.mimetype,
          size: req.file.size,
          uploadedBy: userId,
        })

        return res.status(201).json(mapGalleryImage(image))
      } catch (err) {
        console.error('Error creating gallery image:', err)
        return res.status(500).end()
      }
    },
  )

  app.get('/api/v1/gallery/images', async (req, res) => {
    try {
      const limit = Math.max(1, Math.min(Number(req.query.limit) || 200, 500))
      const images = await GalleryImage.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
      return res.json(images.map(mapGalleryImage))
    } catch (err) {
      console.error('Error listing gallery images:', err)
      return res.status(500).end()
    }
  })
}
