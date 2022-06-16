import express from "express";

 import * as productRoutes from "../controllers/product.controller";
import {productValidation} from "../validations"
import {validate} from "../middlewares"

const router = express.Router();
router.route("/").get(productRoutes.getItemsByQueries);

router.route("/getAll").get(productRoutes.getAllProducts);
router.route("/deleted").get(productRoutes.getProductsDeleted);
router.route("/restore/:id").get(productRoutes.restoreById);
router.route("/count-product").get(productRoutes.countProduct)
router.route("/").post(validate(productValidation.createProduct),productRoutes.create);
router.route("/delete-many").get(validate(productValidation.getProduct),productRoutes.deleteByOption)
router.route("/size").get(validate(productValidation.getProduct),productRoutes.getSizeFromProducts)
router.route("/:id").get(validate(productValidation.getProduct),productRoutes.getById)
router.route("/:id").delete(validate(productValidation.deleteProduct),productRoutes.deleteById)
router.route("/:id").put(validate(productValidation.updateProduct),productRoutes.updateById)



export default router;
