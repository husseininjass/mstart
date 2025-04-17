import { Router } from "express";
import Product from "../controllers/product.js";
import adminAuth from "../middleware/adminauth.js";
const productRouter = Router();
const productController = new Product();
productRouter.post('/create', adminAuth, productController.uploadPhoto(), productController.savePhoto , productController.create)
productRouter.patch('/updatestatus/:id', adminAuth , productController.updateStatus)
productRouter.get('/allproducts', productController.getAllProducts)
export default productRouter;