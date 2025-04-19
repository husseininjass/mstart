import { Router } from "express";
import Customer from "../controllers/customer.js";
import auth from "../middleware/auht.js";
const customerRouter = Router();
const customerController = new Customer();
customerRouter.post('/create', customerController.create)
customerRouter.post('/login', customerController.logIn)
customerRouter.patch('/updatestatus', auth , customerController.updateCustomerStatus)
customerRouter.put('/updateuserphoto',auth,customerController.uploadPhoto(),customerController.savePhoto,customerController.updateCustomerPhoto)
customerRouter.post('/addtocart', auth , customerController.addToCart)
customerRouter.get('/getcartproducts', auth , customerController.getCartProducts)
customerRouter.post('/payment', auth , customerController.payment)
customerRouter.get('/counts', auth , customerController.getCounts)
export default customerRouter;