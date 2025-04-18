import EventEmitter from "node:events";
const orderEvent = new EventEmitter();
const makeOrder = async ()=>{

}
orderEvent.on('payment', makeOrder)
export default orderEvent