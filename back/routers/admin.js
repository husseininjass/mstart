import { Router } from "express";
import Admin from "../controllers/admin.js";
const adminRouter = Router();
const adminController = new Admin();
adminRouter.post('/create', adminController.create)
adminRouter.post('/login', adminController.login)
export default adminRouter;