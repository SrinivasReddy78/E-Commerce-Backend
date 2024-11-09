import mongoose from 'mongoose'
import { IuserWithDocument } from '../types/userType'
import { EUserRole } from '../constant/userConstants'

const userSchema = new mongoose.Schema<IuserWithDocument>(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 72
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        phoneNumber: {
            _id: false,
            isoCode: {
                type: String,
                required: true
            },
            countryCode: {
                type: String,
                required: true
            },
            number: {
                type: String,
                required: true
            }
        },
        timezone: {
            type: String,
            trim: true,
            required: true
        },
        role: {
            type: String,
            enum: EUserRole,
            default: EUserRole.USER,
            required: true
        },
        accountConfirmation: {
            _id: false,
            status: {
                type: Boolean,
                default: false,
                required: true
            },
            token: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: null
            }
        },
        passwordReset: {
            _id: false,
            token: {
                type: String,
                default: null
            },
            expiry: {
                type: Number,
                default: null
            },
            lastResetAt: {
                type: Date,
                default: null
            }
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'seller'
        },
        lastLoginAt: {
            type: Date,
            default: null
        },
        consent: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model<IuserWithDocument>('user', userSchema)
