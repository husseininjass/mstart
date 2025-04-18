import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 
const cartModel = sequelize.define('Cart',{
    ID : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customerID: {
        type : DataTypes.INTEGER,
        references: {
            model: 'Customers',
            key: 'ID'
        }
    }
},{
    timestamps: true,
    tableName: 'cart'
})

export default cartModel;