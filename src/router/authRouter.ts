import { Router } from 'express'
import authController from '../controller/authController'

const userRouter = Router()

userRouter.route('/register').post(authController.register)
userRouter.route('/confirmation/:token').put(authController.confirmation)
userRouter.route('/login').post(authController.login)

export default userRouter
