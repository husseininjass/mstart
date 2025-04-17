import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db/connection.js';
import customerRouter from './routers/customer.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import adminModel from './models/admin.js';
import CustomerModel from './models/customer.js';
import productModel from './models/products.js';
import adminRouter from './routers/admin.js';
import productRouter from './routers/product.js';
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
//global midleware
app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin'); 
    }
}));
//
///routers 
app.use('/customer', customerRouter);
app.use('/admin', adminRouter)
app.use('/product', productRouter)
//////
app.listen(process.env.PORT, ()=>{
    console.log(`server is working on port= ${process.env.PORT}`);
    sequelize.sync({ force: false }) 
    .then(() => {})
    .catch(error => console.error('error happened ', error));
})