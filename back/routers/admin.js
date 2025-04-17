import { Router } from "express";
import Admin from "../controllers/admin.js";
import adminAuth from "../middleware/adminauth.js";
const adminRouter = Router();
const adminController = new Admin();
adminRouter.post('/create', adminController.create)
adminRouter.post('/login', adminController.login)
adminRouter.get('/counts', adminAuth , adminController.counts)
adminRouter.get('/customers', adminAuth , adminController.getAllCustomers)
export default adminRouter;