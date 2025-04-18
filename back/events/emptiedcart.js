import EventEmitter from "node:events";
import cartProduct from "../models/cartProducts.js";

const emptiedCartEvent = new EventEmitter();

const makeCartEmpty = async (cartId) => {
    try {
        await cartProduct.destroy({
            where: {
                cartID: cartId,
            },
        });
    } catch (error) {
        
    }
};
emptiedCartEvent.on('payment', makeCartEmpty);
export default emptiedCartEvent;
