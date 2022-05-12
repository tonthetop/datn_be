import express from "express";

 import * as accountRoutes from "../controllers/account";
import {accountValidaton} from "../validations"
import {validate} from "../middlewares"

const router = express.Router();
router.route("/").get(accountRoutes.getAllAccounts);
router.route("/").post(validate(accountValidaton.createUser),accountRoutes.create);
router.route("/:id").get(validate(accountValidaton.getUser),accountRoutes.getAccountById)
router.route("/:id").delete(accountRoutes.deleteAccount)
router.route("/:id").put(accountRoutes.updateAccountInfo)


export default router;
