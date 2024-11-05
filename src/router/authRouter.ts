import { Router } from 'express'
import authController from '../controller/authController'
import isAuthenticated from '../middleware/isAuthenticated'

const userRouter = Router()

userRouter.route('/register').post(authController.register)
userRouter.route('/confirmation/:token').put(authController.confirmation)
userRouter.route('/login').post(authController.login)
userRouter.route('/self-identification').get(isAuthenticated, authController.selfIdentification)
userRouter.route('/logout').put(isAuthenticated, authController.logout)
userRouter.route('/refresh-token').post(authController.refreshToken)

export default userRouter
