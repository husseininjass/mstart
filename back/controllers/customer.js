import CustomerModel from "../models/customer.js";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import sharp from 'sharp';
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
    async updateCustomerStatus(req,res){
        try {
            const customer = await CustomerModel.findByPk(req.customer.ID, {
                attributes: { exclude: ['Password'] }
            });
            if(!customer){
                return res.status(400).json({message: 'no customer found'})
            }
            const newStatus = req.body.status;
            customer.Status = newStatus;
            await customer.save();
            return res.status(200).json({message: 'customer status has been updated'})
        } catch (error) {
            res.status(403).json({error});
            return;
        }
    }
    uploadPhoto(){
        const multerStorage = multer.memoryStorage();
        const multerFilter = (req, file, cb) => {
            if (!file.mimetype.startsWith('image')) {
                cb('Please upload only image files', false);
            } else {
                cb(null, true); 
            }
        };
        const upload = multer({
            storage : multerStorage,
            fileFilter : multerFilter
        })
        return upload.single('photo')
    }
    async savePhoto(req,res,next){
        const customerId = req.params.id;        
        if (!req.file) {
            return next(new Error('No file uploaded'));
        }
        try {
            req.body.photo = `customer-photo-${customerId}-${Date.now()}.jpeg`;
            await sharp(req.file.buffer)
            .resize(500 ,500)
            .toFormat('jpeg')
            .jpeg({quality : 90})
            .toFile(`public/customers/${req.body.photo}`)
            next(); 
        } catch (error) {
            res.status(403).json({error});
            return;
        }
    }
    async updateCustomerPhoto(req,res){
        const customerId = req.params.id;
        try {
            const customer = await CustomerModel.findByPk(customerId);
            customer.Photo = `http://127.0.0.1:3000/public/customers/${req.body.photo}`
            await customer.save();
            return res.status(200).json({message: 'user photo has been updated'})
        } catch (error) {
            res.status(403).json({error});
            return;
        }
    }
}
export default Customer;