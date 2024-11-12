import { NextFunction, Request, Response } from 'express'
import httpError from '../util/httpError'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import databaseService from '../service/databaseService'
import userModel from '../model/userModel'
import { EUserRole } from '../constant/userConstants'
import { IuserWithDocument } from '../types/userType'
import { IPromoteRequestBody } from '../types/adminType'
import { validateJoiSchema, validatePromoteRoleBody } from '../service/validationService'
import emailService from '../service/emailService'
import logger from '../util/logger'
// import userModel from '../model/userModel'
// import { EUserRole } from '../constant/userConstants'

interface IPaginateOptions extends Request {
    query: {
        limit?: string
        page?: string
    }
}

interface IPromoteBody extends Request {
    params: {
        userId: string
    }
    body: IPromoteRequestBody
}

export default {
    getAllAdmins: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { query } = req as IPaginateOptions
            const { limit, page } = query
            const parsedPage = parseInt(page as string, 10) || 1
            const parsedLimit = parseInt(limit as string, 10) || 10

            if (parsedLimit > 100 || parsedLimit < 2 || isNaN(parsedLimit)) {
                return httpError(next, new Error(responseMessage.INVALID('limit')), req, 400)
            }

            if (parsedPage < 1 || isNaN(parsedPage)) {
                return httpError(next, new Error(responseMessage.INVALID('Page Number')), req, 400)
            }

            const { data, pagination } = await databaseService.paginateData<IuserWithDocument>(
                userModel,
                { role: EUserRole.ADMIN },
                parsedPage,
                parsedLimit,
                '-passwordReset -accountConfirmation -createdAt -updatedAt -consent -__v'
            )
            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                admins: data,
                pagination
            })
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },

    ChangeToNewRole: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Todo :
            // * Parse & Validate the data
            const { params, body } = req as IPromoteBody
            const { userId } = params
            const { value, error } = validateJoiSchema<IPromoteRequestBody>(validatePromoteRoleBody, body)
            if (error) {
                return httpError(next, error, req, 422)
            }
            const { newRole } = value 
            // * Find user By id
            const user = await databaseService.findUserById(userId)
            if (!user) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('user')), req, 404)
            }

            if (user.role === EUserRole.SUPER_ADMIN) {
                return httpError(next, new Error(responseMessage.ACTION_CANT_BE_DONE), req, 400)
            }
            
            // * check if the user is currently of the same role as requested
            if (user.role === newRole as EUserRole) {
                return httpError(next, new Error(responseMessage.SAME_REQUEST_ROLE(newRole)), req, 400)
            }
            // * update the role
            user.role = newRole as EUserRole
            await user.save()
            // * send Email
            const to = [user.email]
            const subject = 'Your Role Has Been Updated on LSHOP'
            const message = ` Hi ${user.name},\n\n We wanted to let you know that your role on LSHOP has been changed to ${user.role}.\n\n If you didn’t make this change or need further help, please contact us immediately at [support@lshop.com].\n\n Best regards,\n The LSHOP Team `

            emailService.sendEmail(to, subject, message).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    meta: err
                })
            })

            httpResponse(req, res, 200, responseMessage.UPDATED_SUCCESSFULLY('Role'))
        } catch (error) {
            httpError(next, error, req, 500)
        }
    }
}
