import mongoose, { Schema } from 'mongoose'

const galleryImageSchema = new Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

export const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema)
