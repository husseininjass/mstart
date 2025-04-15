import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db/connection.js';
import customerRouter from './routers/customer.js';
import CustomerModel from './models/customer.js';
const app = express();
dotenv.config({ path: './config.env' });

const testConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connected to database.');
    } catch (error) {
      console.error('could not connect to db', error);
    }
};
testConnection();
//golbalmidleware
app.use(express.json());

//
///routers 
app.use('/customer', customerRouter);


//////
app.listen(process.env.PORT, ()=>{
    console.log(`server is working on port= ${process.env.PORT}`);
    sequelize.sync({ force: false }) 
    .then(() => {})
    .catch(error => console.error('error happened ', error));
})