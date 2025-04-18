import jwt from 'jsonwebtoken';
import CustomerModel from '../models/customer.js';
const auth = async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        res.status(401).json({message: 'please login first'});
        return;
    }
    try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const customer = await CustomerModel.findByPk(decode.id);
        if(!customer){
            return res.status(400).json({message: 'no user found'});
        }
        if(customer.Status === 'deleted'){
            return res.status(400).json({message: 'deleted user cannot make a request'});
        }
        req.customer = customer;
        next();
    } catch (error) {
        res.status(403).json({error});
        return;
    }
}
export default auth;