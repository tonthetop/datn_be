import express,{Request,Response,NextFunction} from "express";

 import * as discountRoutes from "../controllers/discount";

const router = express.Router();

router.route("/").get(discountRoutes.getAllDiscount);
router.route("/").post(discountRoutes.create);
router.route("/:id").get(discountRoutes.getDiscountById)

export default router;
