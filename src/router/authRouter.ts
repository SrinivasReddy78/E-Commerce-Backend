import { Router } from 'express'
import authController from '../controller/authController'
import isAuthenticated from '../middleware/isAuthenticated'
import rateLimit from '../middleware/rateLimit'

const userRouter = Router()

userRouter.route('/register').post(rateLimit, authController.register)
userRouter.route('/confirmation/:token').put(rateLimit, authController.confirmation)
userRouter.route('/login').post(rateLimit, authController.login)
userRouter.route('/self-identification').get(isAuthenticated, authController.selfIdentification)
userRouter.route('/logout').put(isAuthenticated, authController.logout)
userRouter.route('/refresh-token').post(rateLimit, authController.refreshToken)
userRouter.route('/forgot-password').put(rateLimit, authController.forgotPassword)
userRouter.route('/reset-password/:token').put(rateLimit, authController.resetPassword)
userRouter.route('/change-password').put(isAuthenticated, authController.changePassword)

export default userRouter
