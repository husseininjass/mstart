import CustomerModel from "../models/customer.js";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import sharp from 'sharp';
import cartEvent from "../events/create-cart.js";
import cartModel from "../models/cart.js";
import cartProduct from "../models/cartProducts.js";
import productModel from "../models/products.js";
import Stripe from "stripe";
import emptiedCartEvent from "../events/emptiedcart.js";
import orderEvent from "../events/makeorder.js";
import orderModel from "../models/order.js";
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
            if(loggedInUser.Status === 'deleted'){
                return res.status(400).json({message: 'this email is deleted please contact us first'});
            }
            const isMatch = await loggedInUser.validatePassword(password);
            if(!isMatch){
                return res.status(400).json({message: 'invalid email or password'});
            }
            const token = jwt.sign({id: loggedInUser.ID},process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
            cartEvent.emit('loggedin', loggedInUser.ID)
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
        const customerId = req.customer.ID;
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
    async addToCart(req, res){
        const productID = req.body.productId
        try {
            const cart = await cartModel.findOne({where:{
                customerID: req.customer.ID
            }})
            if(!cart) return res.status(400).json({message: 'no cart found'});
            await cartProduct.create({
                cartID: cart.ID,
                productID: productID
            })
            return res.status(200).json({message: 'prodcut has been added to cart'})
        } catch (error) {
            res.status(400).json({error});
            return;
        }
    }
    async getCartProducts(req ,res){
        try {
            const cart = await cartModel.findOne({
              where: { customerID: req.customer.ID },
            });
        
            if (!cart) {
              return res.status(404).json({ message: 'Cart not found' });
            }
            const productsInCart = await cartProduct.findAll({
              where: { cartID: cart.ID },
              include: [productModel], 
            });
        
            return res.status(200).json({ products: productsInCart });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to get cart products', error });
        }
    }

    async  payment(req, res) {
        try {
            const cart = await cartModel.findOne({
                where: {
                    customerID: req.customer.ID
                },
                include: {
                    model: cartProduct,
                    include: [productModel], 
                }
            });            
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            const totalPrice = cart.CartProducts.reduce((acc, item) => {
                return acc + parseFloat(item.Product.Amount);
            }, 0).toFixed(2);
            const productNames = cart.CartProducts.map(item => item.Product.Name).join(",");
            const productsID = cart.CartProducts.map(item => item.Product.ID);
            
            const stripeSecret = process.env.STRIPE_SECRET;
            if (!stripeSecret) {
                throw new Error("Stripe Secret Key is missing");
            }
    
            const stripe = new Stripe(stripeSecret);
            const product = await stripe.products.create({
                name: productNames,
            });
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: parseInt(totalPrice * 100), 
                currency: 'usd' 
            });
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                success_url: `http://localhost:5173/`, 
                cancel_url: `http://localhost:5173/cart`, 
                client_reference_id: req.customer.ID, 
                line_items: [
                    {
                        price: price.id,
                        quantity: 1 
                    }
                ],
                mode: 'payment',
            });
            orderEvent.emit('payment' , cart.customerID, totalPrice , productsID);
            emptiedCartEvent.emit('payment' , cart.ID)
            return res.status(200).json({ sessionId: session.id });
    
        } catch (error) {
            return res.status(500).json({ message: 'Payment process failed', error: error.message });
        }
    }
    async getCounts(req, res){
        try {
            const customerId = req.customer.ID;
            const ordersCount = await orderModel.findAndCountAll({where:{
                customerId: customerId
            }})
            return res.status(200).json({ordersCount})
        } catch (error) {
            res.status(400).json({error});
            return;
        }
    }
    
}
export default Customer;