import EventEmitter from "node:events";
import orderItem from "../models/orderItem.js";
import orderModel from "../models/order.js";
const orderEvent = new EventEmitter();
const makeOrder = async (customerID, totalAmount, productsID)=>{
    try {
        const order = await orderModel.create({
            customerId: customerID,
            totalAmount: totalAmount
        })
        if(!order) return;
        orderEvent.emit('makeorder', order.ID, productsID)
    } catch (error) {
        console.error(error)
    }
}
const makeOrderItems = async (orderId , prodcutsId)=>{
    try {
        const orderItems = prodcutsId.map(async (product)=>{
            await orderItem.create({
                orderId: orderId,
                productId: product
            })
        }) 
    } catch (error) {
        console.error(error);
    }
}
orderEvent.on('payment', makeOrder)
orderEvent.on('makeorder', makeOrderItems)
export default orderEvent