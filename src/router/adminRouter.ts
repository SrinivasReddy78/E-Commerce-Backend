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


// // Admin Routes (Accessible by both Admin and Super Admin)
// adminRouter.route('/users').get(isAuthenticated, isAdmin, adminController.getAllUsers);
// adminRouter.route('/users/:id/promote').put(isAuthenticated, isAdmin, adminController.promoteToSeller);
// adminRouter.route('/users/:id/suspend').put(isAuthenticated, isAdmin, adminController.suspendUser);
// adminRouter.route('/users/:id').delete(isAuthenticated, isAdmin, adminController.deleteUser);

// // Seller Routes (Admin only)
// adminRouter.route('/sellers').get(isAuthenticated, isAdmin, adminController.getAllSellers);
// adminRouter.route('/sellers/:id/suspend').put(isAuthenticated, isAdmin, adminController.suspendSeller);

// // Super Admin Routes (Exclusive to Super Admin)
// adminRouter.route('/admins').get(isAuthenticated, isSuperAdmin, adminController.getAllAdmins);
// adminRouter.route('/admins/:id/promote').put(isAuthenticated, isSuperAdmin, adminController.promoteToSuperAdmin);
// adminRouter.route('/admins/:id').delete(isAuthenticated, isSuperAdmin, adminController.deleteAdmin);


export default adminRouter