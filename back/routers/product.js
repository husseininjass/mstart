import { Router } from "express";
import Product from "../controllers/product.js";
import adminAuth from "../middleware/adminauth.js";
const productRouter = Router();
const productController = new Product();
productRouter.post('/create', adminAuth, productController.uploadPhoto(), productController.savePhoto , productController.create)
export default productRouter;