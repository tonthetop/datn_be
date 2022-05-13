import express from 'express';
import {validate} from '../middlewares/validate';
import {authValidation} from '../validations';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);

export default router;

