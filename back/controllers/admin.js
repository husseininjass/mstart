import adminModel from "../models/admin.js";
import jwt from 'jsonwebtoken';
import productModel from "../models/products.js";
import CustomerModel from "../models/customer.js";
import { Op } from "sequelize";
class Admin{
    async create(req , res){
        try {
            const { Name, Email, Password } = req.body;
            const newAdmin = await adminModel.create({
                Name,
                Email,
                Password,
            });
            if(newAdmin){
                newAdmin.Password = undefined;
            }
            return res.status(201).json({message: "created",newAdmin});
        } catch (error) {
            return res.status(400).json({error})
        }
    }
    async login(req, res){
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'please enter your email and password'})
        }
        try {
            const admin = await adminModel.findOne({where:{
                Email: email
            }})
            if(!admin){
                return res.status(400).json({message: 'invalid email'});
            }
            const isMatch = await admin.validatePassword(password);
            if(!isMatch){
                return res.status(400).json({message: 'invalid email or password'});
            }
            const token = jwt.sign({id: admin.ID}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
            return res.status(200).json({message: 'logged in',token})
        } catch (error) {
            return res.status(400).json({error})
        }
    }
    async counts(req,res){
        try {
            const totalPropducts = await productModel.count();
            const totalCustomers = await CustomerModel.count();
            return res.status(200).json({totalCustomers,totalPropducts});
        } catch (error) {
            return res.status(400).json({error})
        }
    }
    async getAllCustomers(req , res){
        try {
            const page = req.query.page || 1;
            const limit = 10;
            const offset  = (page -1 ) * limit;
            const searchQuery = req.query.search
            const customers = await CustomerModel.findAll({
                attributes: { exclude: ['Password'] },
                where: searchQuery
                  ? {
                      Name: {
                        [Op.like]: `%${searchQuery}%`
                      }
                    }
                  : undefined,
                limit,
                offset
            });
            return res.status(200).json({customers});
        } catch (error) {
            return res.status(400).json({error})
        }
    }
    async getAllProducts(req , res){
        try {
            const page = req.query.page || 1;
            const limit = 10;
            const offset  = (page -1 ) * limit;
            const searchQuery = req.query.search
            const products = await productModel.findAll({
                where: searchQuery
                  ? {
                      Name: {
                        [Op.like]: `%${searchQuery}%`
                      }
                    }
                  : undefined,
                limit,
                offset
            });
            return res.status(200).json({products});
        } catch (error) {
            return res.status(400).json({error})
        }
    }
    async deleteCustomers(req, res){
        const ids = req.params.id.split(',').map(id => Number(id));
        try {
            await Promise.all(
                ids.map(async (id)=>{
                    const customer = await CustomerModel.findByPk(id);
                    if (!customer) {
                        throw new Error(`Customer with ID ${id} not found`);
                    }
                    customer.Status = 'deleted';
                    await customer.save()
                })
            )
            return res.status(200).json({message: 'customer has been deleted'})
        } catch (error) {
            return res.status(400).json({error})
        }
    }
}
export default Admin;