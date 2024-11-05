import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import httpError from '../util/httpError'
import { ILoginUserRequestBody, IRefresh, IRegisterUserRequestBody, Iuser } from '../types/userType'
import { validateJoiSchema, validateLoginBody, validateRegisterBody } from '../service/validationService'
import quicker from '../util/quicker'
import responseMessage from '../constant/responseMessage'
import databaseService from '../service/databaseService'
import { EUserRole } from '../constant/userConstants'
import config from '../config/config'
import emailService from '../service/emailService'
import logger from '../util/logger'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EApplicationEnvironment } from '../constant/application'

dayjs.extend(utc)

interface IRegisterBody extends Request {
    body: IRegisterUserRequestBody
}
interface IConfirmationBody extends Request {
    params: {
        token: string
    }
    query: {
        code: string
    }
}

interface ILoginBody extends Request {
    body: ILoginUserRequestBody
}

interface ISelfIdentificationRequest extends Request {
    authenticatedUser: Iuser
}

export default {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req as IRegisterBody

            // * Body Validation
            const { value, error } = validateJoiSchema<IRegisterUserRequestBody>(validateRegisterBody, body)
            if (error) {
                return httpError(next, error, req, 422)
            }

            // * Phone Number parsing and Validation
            const { name, phoneNumber, email, password, consent } = value

            const { countryCode, isoCode, number } = quicker.parsePhoneNumber('+' + phoneNumber)
            if (!countryCode || !isoCode || !number) {
                return httpError(next, new Error(responseMessage.INVALID_PHONE_NUMBER), req, 422)
            }

            // * TimeZone
            const timezone = quicker.countryTimeZone(isoCode)
            if (!timezone || timezone.length === 0) {
                return httpError(next, new Error(responseMessage.INVALID_PHONE_NUMBER), req, 422)
            }

            // * Check if user is already registered using email
            const user = await databaseService.findUserByEmail(email)
            if (user) {
                return httpError(next, new Error(responseMessage.ALREADY_EXIST('user', email)), req, 409)
            }
            // * Encrypting Password
            const hashedPassword = await quicker.hashPassword(password)

            // * Account Confirmation object data
            const token = quicker.generateRandomId()
            const code = quicker.generateOtp(6)

            const payload: Iuser = {
                name,
                email,
                phoneNumber: {
                    countryCode,
                    isoCode,
                    number
                },
                password: hashedPassword,
                accountConfirmation: {
                    status: false,
                    code,
                    token,
                    timestamp: null
                },
                passwordReset: {
                    token: null,
                    expiry: null,
                    lastResetAt: null
                },
                lastLoginAt: null,
                role: EUserRole.USER,
                timezone: timezone[0].name,
                consent
            }

            // * Creating User
            const newUser = await databaseService.registerUser(payload)

            // * Sending Confirmation Email
            const confirmationUrl = `${config.FRONTEND_URL}/confirmation/${token}?code=${code}`
            const to = [email]
            const subject = 'Confirm your Account'
            const message = `Hey ${name}, Please click on the link below to confirm your account.\n\n ${confirmationUrl}`

            emailService.sendEmail(to, subject, message).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    meta: err
                })
            })
            // * Sending Success Response
            httpResponse(req, res, 201, responseMessage.CREATED_SUCCESSFULLY('user'), { _id: newUser._id })
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },

    confirmation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { params, query } = req as IConfirmationBody
            const { token } = params
            const { code } = query

            // * Find user using token and code from DB
            const user = await databaseService.findUserByConfirmationTokenAndCode(token, code)
            if (!user) {
                return httpError(next, new Error(responseMessage.INVALID_CONFIRMATION_TOKEN_OR_CODE), req, 400)
            }

            // * Check if the user is already confirmed
            if (user.accountConfirmation.status) {
                return httpError(next, new Error(responseMessage.ACCOUNT_ALREADY_CONFIRMED), req, 400)
            }

            // * if not Confirm the user
            user.accountConfirmation.status = true
            user.accountConfirmation.timestamp = dayjs().utc().toDate()
            await user.save()

            // * Account confirmation Email
            const to = [user.email]
            const subject = 'Your LSHOP Account is Confirmed!'
            const message = `Hi ${user.name},\n Welcome to LSHOP! Your account has been successfully confirmed, and you’re all set to start shopping.\n Explore the latest products, enjoy exclusive deals, and personalize your shopping experience with us.\n If you have any questions, reach out anytime at [support@lshop.com].\n Happy shopping!\n The LSHOP Team`

            emailService.sendEmail(to, subject, message).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    meta: err
                })
            })

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req as ILoginBody
            // * Validate and parse Body
            const { value, error } = validateJoiSchema<ILoginUserRequestBody>(validateLoginBody, body)
            if (error) {
                return httpError(next, error, req, 422)
            }
            const { email, password } = value

            // * Find User
            const user = await databaseService.findUserByEmail(email, '+password')
            if (!user) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('user')), req, 404)
            }

            // * Validate Password
            const isValidPassword = await quicker.comparePassword(password, user.password)
            if (!isValidPassword) {
                return httpError(next, new Error(responseMessage.INVALID_EMAIL_OR_PASSWORD), req, 400)
            }

            // * Generate Access Token & Refresh Token
            const accessToken = quicker.generateToken({ userID: user._id }, config.ACCESS_TOKEN.SECRET as string, config.ACCESS_TOKEN.EXPIRY)
            const refreshToken = quicker.generateToken({ userID: user._id }, config.REFRESH_TOKEN.SECRET as string, config.REFRESH_TOKEN.EXPIRY)

            // * Update Last lastLogin Information
            user.lastLoginAt = dayjs().utc().toDate()
            await user.save()

            // * Refresh Token Store
            const refreshTokenPayload: IRefresh = {
                token: refreshToken
            }

            await databaseService.createRefreshToken(refreshTokenPayload)

            // * Send Cookie
            let DOMAIN = ''
            try {
                const url = new URL(config.SERVER_URL as string)
                DOMAIN = url.hostname
            } catch (error) {
                throw error
            }
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                path: '/api/v1',
                domain: DOMAIN,
                maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
                sameSite: 'strict',
                secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
            }).cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/api/v1',
                domain: DOMAIN,
                maxAge: 1000 * config.REFRESH_TOKEN.EXPIRY,
                sameSite: 'strict',
                secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
            })

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                accessToken,
                refreshToken
            })
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },

    selfIdentification: (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authenticatedUser } = req as ISelfIdentificationRequest
            httpResponse(req, res, 200, responseMessage.SUCCESS, authenticatedUser)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    }
}
