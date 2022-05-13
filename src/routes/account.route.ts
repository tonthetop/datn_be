import express from "express";

 import * as accountRoutes from "../controllers/account.controller";
import {accountValidaton} from "../validations"
import {validate} from "../middlewares"

const router = express.Router();
router.route("/").get(accountRoutes.getAll);
router.route("/").post(validate(accountValidaton.createUser),accountRoutes.create);
router.route("/:id").get(validate(accountValidaton.getUser),accountRoutes.getById)
router.route("/:id").delete(validate(accountValidaton.deleteUser),accountRoutes.deleteById)
router.route("/:id").put(validate(accountValidaton.updateUser),accountRoutes.updateById)



export default router;
