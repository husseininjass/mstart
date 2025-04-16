import adminModel from "../models/admin.js";
import jwt from 'jsonwebtoken';
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
}
export default Admin;