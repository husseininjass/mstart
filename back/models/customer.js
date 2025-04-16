import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 
import bcrypt from 'bcryptjs';

const CustomerModel = sequelize.define('Customer', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Update_DateTime_UTC: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Last_Login_DateTime_UTC: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
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
  Phone: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: "Phone number must be unique"
    },
    validate: {
      notEmpty: { msg: "Phone number is required" },
    },
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
  Gender: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Gender is required" },
      isIn: {
        args: [['male', 'female']],
        msg: "Gender must be either male or female",
      },
    },
  },
  Date_Of_Birth: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Date of birth is required" },
      isDate: { msg: "Date of birth must be a valid date" },
    },
  },
  Photo: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: 'Photo must be a valid URL' }
    }
  },
}, {
  timestamps: true, 
  tableName: 'Customers',
  hooks: {
    beforeCreate: async (customer) => {
      if (customer.Password) {
        customer.Password = await bcrypt.hash(customer.Password, 8);
      }
    },
  },
});
CustomerModel.prototype.validatePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.Password);
};
export default CustomerModel;