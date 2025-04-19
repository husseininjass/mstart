import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 
const orderItem = sequelize.define('OrderItem',{
    ID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId:{
        type: DataTypes.INTEGER,
        references:{
            model: 'orders',
            key: 'ID'
        },
        allowNull: false
    },
    productId:{
        type: DataTypes.INTEGER,
        references: {
            model: 'products',
            key: 'ID'
        },
        allowNull: false
    }
},{
    timestamps: true,
    tableName: 'order_item'
})
export default orderItem;