import { NextFunction, Request, Response } from 'express'
import httpError from '../util/httpError'
import { Iuser } from '../types/userType'
import quicker from '../util/quicker'
import config from '../config/config'
import { JwtPayload } from 'jsonwebtoken'
import databaseService from '../service/databaseService'
import responseMessage from '../constant/responseMessage'

interface IAuthenticatedUser extends Request {
    authenticatedUser: Iuser
}

interface IDecryptedJwt extends JwtPayload {
    userID: string
}

export default async (request: Request, _res: Response, next: NextFunction) => {
    try {
        const req = request as IAuthenticatedUser
        const { cookies } = req
        const { accessToken } = cookies as {
            accessToken: string | undefined
        }
        if (accessToken) {
            // * Verify Token
            const { userID } = quicker.verifyToken(accessToken, config.ACCESS_TOKEN.SECRET as string) as IDecryptedJwt

            // * Find user By Id
            const user = await databaseService.findUserById(userID)
            if(user) {
                req.authenticatedUser = user
                return next()
            }
        }
        httpError(next, new Error(responseMessage.UNAUTHORISED), req, 401)
    } catch (err) {
        httpError(next, err, request, 500)
    }
}
