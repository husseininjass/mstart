import { Router } from "express";
import Customer from "../controllers/customer.js";
const customerRouter = Router();
const customerController = new Customer();
customerRouter.post('/create', customerController.create)
customerRouter.post('/login', customerController.logIn)
export default customerRouter;