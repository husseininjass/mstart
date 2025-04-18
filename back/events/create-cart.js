import EventEmitter from "node:events";
import cartModel from "../models/cart.js";
const cartEvent = new EventEmitter();
const createCart = async (customerId)=>{
    const cart = await cartModel.findOne({where:{
        customerID: customerId
    }});
    if(cart) return;
    await cartModel.create({
        customerID: customerId
    })
}
cartEvent.on('loggedin', createCart)
export default cartEvent;