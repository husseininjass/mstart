import jwt from 'jsonwebtoken';
import adminModel from '../models/admin.js';
const adminAuth = async (req , res , next)=>{
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
        const admin = await adminModel.findByPk(decode.id);
        if(!admin){
            return res.status(400).json({message: 'no admin found'});
        }
        req.admin = admin
        next();
    } catch (error) {
        res.status(403).json({error});
        return;
    }
}
export default adminAuth;