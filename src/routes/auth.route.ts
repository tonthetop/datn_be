import express from 'express';
import { validate,authenticationToken,authorization} from '../middlewares';
import {authValidation} from '../validations';
import * as authController from '../controllers/auth.controller';
const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);
router.get('/logout', authenticationToken, authController.logout);
router.get('/logout-all', authenticationToken, authController.logoutAll);


export default router;

