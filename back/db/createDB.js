import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({path: './config.env'}); 

const createDatabase = async () => {
  const sequelize = new Sequelize('', process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', 
    logging: false,
  });

  try {
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log('Database created successfully');
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

createDatabase();
