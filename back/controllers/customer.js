import CustomerModel from "../models/customer.js";
import jwt from 'jsonwebtoken';
class Customer{
    async create(req,res){
        try {
            const { Name, Email, Password, Phone, Gender, Date_Of_Birth } = req.body;
            const newCustomer = await CustomerModel.create({
                Name,
                Email,
                Password,
                Phone,
                Gender,
                Date_Of_Birth,
            });
            if(newCustomer){
                newCustomer.Password = undefined;
            }
            return res.status(201).json({message: "created",newCustomer});
        } catch (error) {
            return res.status(400).json({error})
        }
    }
    async logIn(req,res){
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'please enter your email and password'})
        }
        try {
            const loggedInUser = await CustomerModel.findOne({where: {
                Email: email
            }})
            if(!loggedInUser){
                return res.status(400).json({message: 'no email found'});
            }
            const isMatch = await loggedInUser.validatePassword(password);
            if(!isMatch){
                return res.status(400).json({message: 'invalid email or password'});
            }
            const token = jwt.sign({id: loggedInUser.ID},process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
            return res.status(200).json({message: 'logged in',token})
        } catch (error) {
            return res.status(400).json({error})
        }
    }
}
export default Customer;