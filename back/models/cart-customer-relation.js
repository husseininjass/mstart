import CustomerModel from "./customer.js";
import cartModel from "./cart.js";
import productModel from "./products.js";
import cartProduct from "./cartProducts.js";
// Customer 1:1 Cart
CustomerModel.hasOne(cartModel, {
  foreignKey: 'customerID',
  sourceKey: 'ID',
});
cartModel.belongsTo(CustomerModel, {
  foreignKey: 'customerID',
  targetKey: 'ID',
});

// Cart 1:M CartItems
cartModel.hasMany(cartProduct, {
  foreignKey: 'cartID',
  sourceKey: 'ID',
});
cartProduct.belongsTo(cartModel, {
  foreignKey: 'cartID',
  targetKey: 'ID',
});

// Product 1:M CartItems
productModel.hasMany(cartProduct, {
  foreignKey: 'productID',
  sourceKey: 'ID',
});
cartProduct.belongsTo(productModel, {
  foreignKey: 'productID',
  targetKey: 'ID',
});
