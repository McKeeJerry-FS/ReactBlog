import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: String,
    tags: [String],
  },
  { timestamps: true },
)

export const Post = mongoose.model('Post', postSchema)
