import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    session: { type: String, required: true },
    action: { type: String, required: true },
    date: { type: Date, default: Date.now },
})

export const Event = mongoose.model('events', eventSchema)