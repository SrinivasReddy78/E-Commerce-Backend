import { Router } from 'express'
import authController from '../controller/authController'

const userRouter = Router()

userRouter.route('/register').post(authController.register)
userRouter.route('/confirmation/:token').put(authController.confirmation)

export default userRouter
