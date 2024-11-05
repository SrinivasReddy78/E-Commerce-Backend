import os from 'os'
import config from '../config/config'
import { parsePhoneNumber } from 'libphonenumber-js'
import { getTimezonesForCountry } from 'countries-and-timezones'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import { randomInt } from 'crypto'
import jwt from 'jsonwebtoken'

export default {
    getSystemHealth: () => {
        // Return a promise that resolves with the system health
        return {
            cpuUsage: os.loadavg(),
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`
        }
    },

    getApplicationHealth: () => {
        // Return a promise that resolves with the application health
        return {
            environment: config.ENV,
            uptime: `${process.uptime().toFixed(2)} Seconds`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
            }
        }
    },

    parsePhoneNumber: (phoneNumber: string) => {
        try {
            const parsedPhoneNumber = parsePhoneNumber(phoneNumber)

            if (parsedPhoneNumber) {
                return {
                    countryCode: parsedPhoneNumber.countryCallingCode,
                    isoCode: parsedPhoneNumber.country || null,
                    number: parsedPhoneNumber.formatInternational()
                }
            }

            return {
                countryCode: null,
                isoCode: null,
                number: null
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return {
                countryCode: null,
                isoCode: null,
                number: null
            }
        }
    },

    countryTimeZone: (isoCode: string) => {
        return getTimezonesForCountry(isoCode)
    },

    hashPassword: (password: string) => {
        return bcrypt.hash(password, 10)
    },
    comparePassword: (attemptedPass: string, encrptPass: string) => {
        return bcrypt.compare(attemptedPass, encrptPass)
    },
    generateRandomId: () => v4(),
    generateOtp: (length: number) => {
        const min = Math.pow(10, length - 1)
        const max = Math.pow(10, length) - 1
        return randomInt(min, max).toString()
    },
    generateToken: (payload: object, secret: string, expiry: number) => {
        return jwt.sign(payload, secret, {
            expiresIn: expiry
        })
    },
    verifyToken: (token: string, secret: string) => {
        return jwt.verify(token, secret)
    },
    getDomainFromUrl: (url: string) => {
        try {
            const parsedUrl = new URL(url)
            return parsedUrl.hostname
        } catch (error) {
            throw error
        }
    }
}
