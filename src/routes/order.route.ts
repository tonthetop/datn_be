import express from 'express';

import * as orderRoutes from '../controllers/order.controller';
import * as paymentRoutes from '../controllers/payment.controller';
import { authenticationToken, authorization } from '../middlewares';
import { orderValidation } from '../validations';
import { validate } from '../middlewares';

const router = express.Router();
router.route('/').get(orderRoutes.getItemsByQueries);
router.route('/deleted').get(orderRoutes.getItemsDeleted);
router.route('/restore/:id').get(orderRoutes.restoreById);
router.route('/count-revenue').get(orderRoutes.countRevenue);
router.route('/get-by-email-or-phone').post(validate(orderValidation.getOrderByEmailOrPhone),orderRoutes.getByEmailOrPhone);
router.route('/').post(authenticationToken,authorization.checkMemberRole,validate(orderValidation.createOrder),orderRoutes.create,paymentRoutes.createPaymentUrl);
router.route('/:id').get(validate(orderValidation.getOrder), orderRoutes.getById);
router.route('/:id').put(validate(orderValidation.updateOrder), orderRoutes.updateById);
router.route('/:id').delete(validate(orderValidation.deleteOrder), orderRoutes.deleteById);
router.route('/delete-force/:id').delete(validate(orderValidation.deleteOrder), orderRoutes.deleteForceById);

export default router;
