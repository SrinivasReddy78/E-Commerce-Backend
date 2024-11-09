import mongoose, { Document, Model } from 'mongoose'
import config from '../config/config'
import userModel from '../model/userModel'
import { IRefresh, Iuser, PaginationResult } from '../types/userType'
import refreshTokenModel from '../model/refreshTokenModel'

export default {
    connect: async () => {
        // Connect to the database
        try {
            await mongoose.connect(config.DATABASE_URL as string)
            return mongoose.connection
        } catch (error) {
            throw error
        }
    },
    findUserByEmail: (email: string, select: string = '') => {
        return userModel.findOne({ email }).select(select)
    },
    findUserById: (id: string, select: string = '') => {
        return userModel.findById(id).select(select)
    },
    registerUser: (payload: Iuser) => {
        return userModel.create(payload)
    },
    findUserByConfirmationTokenAndCode: (token: string, code: string) => {
        return userModel.findOne({
            'accountConfirmation.token': token,
            'accountConfirmation.code': code
        })
    },
    findUserByResetToken: (token: string) => {
        return userModel.findOne({
            'passwordReset.token': token
        })
    },
    createRefreshToken: (payload: IRefresh) => {
        return refreshTokenModel.create(payload)
    },
    deleteRefreshToken: (token: string) => {
        return refreshTokenModel.deleteOne({ token: token })
    },
    findRefreshToken: (token: string) => {
        return refreshTokenModel.findOne({ token })
    },
    paginateData: async <T extends Document>(model: Model<T>, filter: object = {}, page: number = 1, limit: number = 10, select: string = ''): Promise<PaginationResult<T>> => {
        try {
            const skip = (page - 1) * limit

            // Count total documents matching the filter
            const totalData = await model.countDocuments(filter)

            // Calculate total pages
            const totalPages = Math.ceil(totalData / limit)

            // Fetch the data for the current page
            const data = await model.find(filter).skip(skip).limit(limit).select(select)

            // Return the data along with pagination details
            return {
                data,
                pagination: {
                    page,
                    totalData,
                    totalPages
                }
            }
        } catch (error) {
            // Handle the error
            throw new Error(`Error occurred while Paginating data: ${error as string}`)
        }
    }
}
