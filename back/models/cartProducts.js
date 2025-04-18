import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 
const cartProduct = sequelize.define('CartProducts', {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'cart',
        key: 'ID'
      },
      onDelete: 'CASCADE'
    },
    productID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'products',
        key: 'ID'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'cart_products'
});
export default cartProduct;