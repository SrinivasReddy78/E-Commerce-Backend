import { Router } from 'express'
import adminController from '../controller/adminController'
import isSuperAdmin from '../middleware/isSuperAdmin'

const adminRouter = Router()

// Super Admin Routes (Exclusive to Super Admin)
adminRouter.route('/admins').get(isSuperAdmin, adminController.getAllAdmins)



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
// adminRouter.route('/admins').post(isAuthenticated, isSuperAdmin, adminController.createAdmin);
// adminRouter.route('/admins/:id').delete(isAuthenticated, isSuperAdmin, adminController.deleteAdmin);
// adminRouter.route('/admins/:id/promote').put(isAuthenticated, isSuperAdmin, adminController.promoteToSuperAdmin);


export default adminRouter