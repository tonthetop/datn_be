import express from "express";

 import * as productRoutes from "../controllers/product.controller";
import {productValidation} from "../validations"
import {validate} from "../middlewares"

const router = express.Router();
router.route("/").get(productRoutes.getAll);
router.route("/").post(validate(productValidation.createProduct),productRoutes.create);
router.route("/:id").get(validate(productValidation.getProduct),productRoutes.getById)
router.route("/:id").delete(validate(productValidation.deleteProduct),productRoutes.deleteById)
router.route("/:id").put(validate(productValidation.updateProduct),productRoutes.updateById)



export default router;
