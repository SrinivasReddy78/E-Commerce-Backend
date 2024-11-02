import { Router } from 'express'
import authController from '../controller/authController'

const userRouter = Router()

userRouter.route('/register').post(authController.register)

export default userRouter
