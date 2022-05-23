import express from "express";

 import * as orderRoutes from "../controllers/order.controller";
import {orderValidation} from "../validations"
import {validate} from "../middlewares"

const router = express.Router();
router.route("/").get(orderRoutes.getItemsByQueries);
router.route("/").post(validate(orderValidation.createOrder),orderRoutes.create);
router.route("/:id").get(validate(orderValidation.getOrder),orderRoutes.getById)
router.route("/:id").delete(validate(orderValidation.deleteOrder),orderRoutes.deleteById)
router.route("/:id").put(validate(orderValidation.updateOrder),orderRoutes.updateById)



export default router;
