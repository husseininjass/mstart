import multer from 'multer';
import sharp from 'sharp';
import productModel from '../models/products.js';
import { Op } from 'sequelize';
class Product{
    uploadPhoto(){
        const multerStorage = multer.memoryStorage();
        const multerFilter = (req, file, cb) => {
            if (!file.mimetype.startsWith('image')) {
                cb('Please upload only image files', false);
            } else {
                cb(null, true); 
            }
        };
        const upload = multer({
            storage : multerStorage,
            fileFilter : multerFilter
        })
        return upload.single('photo')
    }
    async savePhoto(req,res,next){
        if (!req.file) {
            return next(new Error('No file uploaded'));
        }
        try {
            req.body.photo = `product-photo-${Date.now()}.jpeg`;
            await sharp(req.file.buffer)
            .resize(500 ,500)
            .toFormat('jpeg')
            .jpeg({quality : 90})
            .toFile(`public/products/${req.body.photo}`)
            next(); 
        } catch (error) {
            res.status(403).json({error});
            return;
        }
    }
    async create(req, res){
        try {
            const { Name, Description, Amount, photo } = req.body;
            const newProduct = await productModel.create({
                Name,
                Description,
                Amount,
                photo: `http://127.0.0.1:3000/public/products/${req.body.photo}`
            })
            if(!newProduct){
                return res.status(400).json({message: 'could not create new product'});
            }
            return res.status(201).json({message: 'product created', newProduct});
        } catch (error) {
            res.status(403).json({error});
            return;
        }
    }
    async updateStatus(req, res){
        const productId = req.params.id;
        try {
            const product = await productModel.findByPk(productId);
            if(!product){
                return res.status(400).json({message: 'no product found'})
            }
            const newStatus = req.body.status;
            product.Status = newStatus;
            await product.save();
            return res.status(200).json({message: 'product status has been updated'})
        } catch (error) {
            res.status(403).json({error});
            return;
        }
    }
    async getAllProducts(req, res){
        try {
            const page = req.query.page || 1;
            const limit = 10;
            const offset  = (page -1 ) * limit;
            const searchQuery = req.query.search
            const products = await productModel.findAll({
                where: searchQuery
                  ? {
                      Name: {
                        [Op.like]: `%${searchQuery}%`
                      }
                    }
                  : undefined,
                limit,
                offset
            });
            return res.status(200).json({products});
        } catch (error) {
            res.status(403).json({error});
            return;
        }
    }
}
export default Product;