import express from "express";

 import * as accountRoutes from "../controllers/account.controller";
import {accountValidaton} from "../validations"
import {authenticationToken, authorization, validate} from "../middlewares"

const router = express.Router();
router.route("/").get(authenticationToken,authorization.checkAdminRole,accountRoutes.getAll);
router.route("/").post(validate(accountValidaton.createUser),accountRoutes.create);
router.route("/verify-email").get(accountRoutes.verifyEmail)
router.route("/:id").get(authenticationToken,authorization.checkMemberRole,validate(accountValidaton.getUser),accountRoutes.getById)
router.route("/:id").delete(authenticationToken,authorization.checkAdminRole,validate(accountValidaton.deleteUser),accountRoutes.deleteById)
router.route("/:id").put(authenticationToken,authorization.checkMemberRole,validate(accountValidaton.updateUser),accountRoutes.updateById)



export default router;
