import { NextFunction, Request, Response } from 'express'
import httpError from '../util/httpError'
import responseMessage from '../constant/responseMessage'
import { Iuser } from '../types/userType'
import { EUserRole } from '../constant/userConstants'

interface IAuthenticatedUser extends Request {
    authenticatedUser: Iuser
}

export default (req: Request, _res: Response, next: NextFunction) => {
    try {
        const { authenticatedUser } = req as IAuthenticatedUser

        if(authenticatedUser?.role === EUserRole.ADMIN || authenticatedUser?.role === EUserRole.SUPER_ADMIN){
            return next()
        }
        httpError(next, new Error(responseMessage.UNAUTHORISED), req, 401)
    } catch (error) {
        httpError(next, error, req, 500)
    }
}
