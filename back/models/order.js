import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 
const orderModel = sequelize.define('Order',{
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId:{
        type: DataTypes.INTEGER,
        references:{
            model: 'Customers',
            key: 'ID'
        }
    },
    totalAmount:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    currency:{
        type: DataTypes.STRING,
        defaultValue: 'JOD'
    }
},{
    timestamps: true,
    tableName: 'orders'
})
export default orderModel;