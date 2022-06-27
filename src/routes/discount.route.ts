import express from 'express';
import { discountValidation } from '../validations';
import { validate, authenticationToken, authorization } from '../middlewares';
import * as discountRoutes from '../controllers/discount.controller';
const router = express.Router();

router.route('/')
  .get(discountRoutes.getAll);
router
  .route('/')
  .post(authenticationToken, authorization.checkAdminRole, validate(discountValidation.createDiscount), discountRoutes.create);
router
  .route('/:id')
  .get(discountRoutes.getById);
router
  .route('/:id')
  .delete(authenticationToken, authorization.checkAdminRole, validate(discountValidation.deleteDiscount), discountRoutes.deleteById);
router
  .route('/:id')
  .put(authenticationToken, authorization.checkAdminRole, validate(discountValidation.updateDiscount), discountRoutes.updateById);
  
export default router;
