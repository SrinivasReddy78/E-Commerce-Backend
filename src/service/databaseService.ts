import mongoose from 'mongoose'
import config from '../config/config'
import userModel from '../model/userModel'
import { IRefresh, Iuser } from '../types/userType'
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
    registerUser: (payload: Iuser) => {
        return userModel.create(payload)
    },
    findUserByConfirmationTokenAndCode: (token: string, code: string) => {
        return userModel.findOne({ 
            'accountConfirmation.token' : token,
            'accountConfirmation.code' : code
         })
    },
    createRefreshToken: (payload: IRefresh) => {
        return refreshTokenModel.create(payload)
    }
}
