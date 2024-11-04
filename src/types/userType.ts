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

export interface IRegisterUserRequestBody {
    name: string
    email: string
    password: string
    phoneNumber: string
    consent: boolean
}