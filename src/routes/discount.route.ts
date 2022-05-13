import express from 'express';
import { discountValidation } from '../validations';
import { validate } from '../middlewares';
import * as discountRoutes from '../controllers/discount.controller';

const router = express.Router();

router.route('/').get(discountRoutes.getAll);
router
  .route('/')
  .post(validate(discountValidation.createDiscount), discountRoutes.create);
router
  .route('/:id')
  .get(validate(discountValidation.getDiscount), discountRoutes.getById);
router
  .route('/:id')
  .delete(
    validate(discountValidation.deleteDiscount),
    discountRoutes.deleteById
  );
router
  .route('/:id')
  .put(validate(discountValidation.updateDiscount), discountRoutes.updateById);
export default router;
