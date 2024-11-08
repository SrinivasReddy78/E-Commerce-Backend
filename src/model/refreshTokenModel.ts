import mongoose from 'mongoose'
import { IRefresh } from '../types/userType'
import config from '../config/config'

const refreshSchema = new mongoose.Schema<IRefresh>(
    {
        token: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

refreshSchema.index({
    createdAt: -1
}, {expireAfterSeconds: config.REFRESH_TOKEN.EXPIRY})

export default mongoose.model<IRefresh>('refresh-token', refreshSchema)
