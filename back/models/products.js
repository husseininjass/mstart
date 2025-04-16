import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const productModel = sequelize.define('Products',{
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Name:{
        type: DataTypes.STRING(255),
        allowNull: false,
        validate:{
            notEmpty: {msg: 'name must not be empty'},
            len: {
                args: [3, 100],
                msg: "Name must be between 3 and 100 characters",
            },
        }
    },
    Description: {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: {msg: 'please give a description'}
        }
    },
    Status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'active',
        validate: {
          isIn: {
            args: [['active', 'deleted','In Active']],  
            msg: 'Status must be either active or deleted'
          }
        }
    },
    Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Currency: {
        type: DataTypes.STRING,
        defaultValue: 'JOD',
        allowNull: false,
    },
    photo:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: true,
    tableName: 'products'
})
export default productModel;