import { NextFunction, Request, Response } from 'express'
import httpError from '../util/httpError'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import databaseService from '../service/databaseService'
import userModel from '../model/userModel'
import { EUserRole } from '../constant/userConstants'
import { IuserWithDocument } from '../types/userType'
// import userModel from '../model/userModel'
// import { EUserRole } from '../constant/userConstants'


interface IPaginateOptions extends Request {
    query: {
        limit?: string 
        page?: string
    }
}

export default {
    getAllAdmins: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {query} = req as IPaginateOptions
            const {limit,page} = query
            const parsedPage = parseInt(page as string, 10) || 1
            const parsedLimit = parseInt(limit as string, 10) || 10

            if(parsedLimit > 100 || parsedLimit < 2 || isNaN(parsedLimit)){
                return httpError(next, new Error(responseMessage.INVALID('limit')), req, 400)
            }

            if(parsedPage < 1 || isNaN(parsedPage)) {
                return httpError(next, new Error(responseMessage.INVALID('Page Number')), req, 400)
            }

            const {data, pagination} = await databaseService.paginateData<IuserWithDocument>(userModel, {role: EUserRole.ADMIN}, parsedPage, parsedLimit, '-passwordReset -accountConfirmation -createdAt -updatedAt -consent -__v')
            httpResponse(req, res, 200, responseMessage.SUCCESS, {
            admins : data,
            pagination
            })
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },

}
