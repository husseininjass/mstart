import CustomerModel from "./customer.js";
import cartModel from "./cart.js";
import productModel from "./products.js";
import cartProduct from "./cartProducts.js";
import orderModel from "./order.js";
import orderItem from "./orderItem.js";

CustomerModel.hasOne(cartModel, {
  foreignKey: 'customerID',
  sourceKey: 'ID',
});
cartModel.belongsTo(CustomerModel, {
  foreignKey: 'customerID',
  targetKey: 'ID',
});

cartModel.hasMany(cartProduct, {
  foreignKey: 'cartID',
  sourceKey: 'ID',
});
cartProduct.belongsTo(cartModel, {
  foreignKey: 'cartID',
  targetKey: 'ID',
});

productModel.hasMany(cartProduct, {
  foreignKey: 'productID',
  sourceKey: 'ID',
});
cartProduct.belongsTo(productModel, {
  foreignKey: 'productID',
  targetKey: 'ID',
});
orderModel.hasMany(orderItem, {
  foreignKey: 'orderId',
  sourceKey: 'ID'
});

orderItem.belongsTo(orderModel, {
  foreignKey: 'orderId',
  targetKey: 'ID'
});

orderItem.belongsTo(productModel, {
  foreignKey: 'productId',
  targetKey: 'ID'
});

productModel.hasMany(orderItem, {
  foreignKey: 'productId',
  sourceKey: 'ID'
});
CustomerModel.hasMany(orderModel, {
  foreignKey: 'customerId',
  sourceKey: 'ID',
});

orderModel.belongsTo(CustomerModel, {
  foreignKey: 'customerId',
  targetKey: 'ID',
});