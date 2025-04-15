import { Router } from "express";
import Customer from "../controllers/customer.js";
const customerRouter = Router();
const customerController = new Customer();
customerRouter.post('/create', customerController.create)
export default customerRouter;