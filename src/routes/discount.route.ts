import express from 'express';
import { discountValidation } from '../validations';
import { validate,authenticationToken,authorization} from '../middlewares';
import * as discountRoutes from '../controllers/discount.controller';
const router = express.Router();

router.route('/').get(discountRoutes.getAll);
router
  .route('/')
  .post(authenticationToken,authorization.checkMemberRole,validate(discountValidation.createDiscount), discountRoutes.create);
router
  .route('/:id')
  .get(authenticationToken,authorization.checkMemberRole,validate(discountValidation.getDiscount), discountRoutes.getById);
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
