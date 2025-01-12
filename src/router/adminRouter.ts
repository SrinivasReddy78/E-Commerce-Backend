import { Router } from 'express'
import adminController from '../controller/adminController'
import isSuperAdmin from '../middleware/isSuperAdmin'
import isAdmin from '../middleware/isAdmin'

const adminRouter = Router()

// Super Admin Routes (Exclusive to Super Admin)
adminRouter.route('/admins').get(isSuperAdmin, adminController.getAllAdmins)
adminRouter.route('/users/:userId/change-role').put(isSuperAdmin, adminController.ChangeToNewRole);
adminRouter.route('/:adminId').delete(isSuperAdmin, adminController.deleteAdmin);


// Admin Routes (Accessible by both Admin and Super Admin)
adminRouter.route('/users').get(isAdmin, adminController.getAllUsers);
adminRouter.route('/users/:userId').delete(isAdmin, adminController.deleteUser);



export default adminRouter