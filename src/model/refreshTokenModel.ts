import mongoose from 'mongoose'
import { IRefresh } from '../types/userType'

const refreshSchema = new mongoose.Schema<IRefresh>(
    {
        token: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model<IRefresh>('refresh-token', refreshSchema)
