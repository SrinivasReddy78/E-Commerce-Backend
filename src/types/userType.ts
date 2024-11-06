import { JwtPayload } from 'jsonwebtoken'
import { EUserRole } from '../constant/userConstants'

export interface Iuser {
    name: string
    email: string
    password: string
    phoneNumber: {
        countryCode: string
        isoCode: string
        number: string
    }
    timezone: string
    role: EUserRole
    store?: string
    accountConfirmation: {
        status: boolean
        token: string
        code: string
        timestamp: Date | null
    }
    passwordReset: {
        token: string | null
        expiry: number | null
        lastResetAt: Date | null
    }
    lastLoginAt: Date | null
    consent: boolean
}

export interface IuserWithID extends Iuser {
    _id: string
}

export interface IRefresh {
    token: string
}

export interface IRegisterUserRequestBody {
    name: string
    email: string
    password: string
    phoneNumber: string
    consent: boolean
}

export interface ILoginUserRequestBody {
    email: string
    password: string
}

export interface IDecryptedJwt extends JwtPayload {
    userID: string
}

export interface IForgotPasswordRequestBody {
    email: string
}

export interface IResetPasswordRequestBody {
    newPassword: string
}

export interface IChangePasswordRequestBody {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}