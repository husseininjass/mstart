import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 
import bcrypt from 'bcryptjs';
const adminModel = sequelize.define('Admins',{
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name is required" },
          len: {
            args: [3, 100],
            msg: "Name must be between 3 and 100 characters",
          },
        },
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required" },
          len: {
            args: [8],
            msg: "Password must be at least 8 characters long",
          },
        },
    },
    Email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
          msg: "Email must be unique"
        },
        validate: {
          notEmpty: { msg: "Email is required" },
          isEmail: { msg: "Email must be a valid email address" },
        },
    },
},{
    timestamps: true,
    tableName: 'admins',
    hooks: {
        beforeCreate: async (admin)=>{
            if(admin.Password){
                admin.Password  = await bcrypt.hash(admin.Password,8)
            }
        }
    }
})
adminModel.prototype.validatePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.Password);
};
export default adminModel;