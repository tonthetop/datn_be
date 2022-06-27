import express from 'express';

import * as productRoutes from '../controllers/product.controller';
import { productValidation } from '../validations';
import { validate, authenticationToken, authorization } from '../middlewares';
import { uploadCloud } from '../config/cloudinary.config';

const router = express.Router();

//get products by queries
router
    .route('/')
    .get(productRoutes.getItemsByQueries);

//get all exits products
router
    .route('/getAll')
    .get(productRoutes.getAllProducts);
// get all deleted products
router
    .route('/deleted')
    .get(productRoutes.getProductsDeleted);
//restore By Id
router
    .route('/restore/:id')
    .get(authenticationToken, authorization.checkAdminRole, productRoutes.restoreById);
//upload image
router.post(

    '/cloudinary-upload',
    uploadCloud.array('files'),
    (req: any, res: any, next) => {
        if (!req.files) {
            next(new Error('No file uploaded!'));
            return;
        }
        console.log(req.files)
        res.json(req.files.map((e: any) => e.path));
    }
);
// for chart
router
    .route('/count-product')
    .get(authenticationToken, authorization.checkAdminRole, productRoutes.countProduct);
//create
router
    .route('/')
    .post(authenticationToken, authorization.checkAdminRole, validate(productValidation.createProduct), productRoutes.create);
//getSizesFromProducts
router
    .route('/size')
    .get(productRoutes.getSizeFromProducts);
//get By Id
router
    .route('/:id')
    .get(validate(productValidation.getProduct), productRoutes.getById);
//soft delete by Id
router
    .route('/:id')
    .delete(authenticationToken, authorization.checkAdminRole, validate(productValidation.deleteProduct), productRoutes.deleteById);
//force delete by Id
router
    .route('/delete-force/:id')
    .delete(authenticationToken, authorization.checkAdminRole, validate(productValidation.deleteProduct), productRoutes.deleteForceById);
//update by Id
router
    .route('/:id')
    .put(authenticationToken, authorization.checkAdminRole, validate(productValidation.updateProduct), productRoutes.updateById);

export default router;
