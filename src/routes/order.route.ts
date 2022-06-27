import express from 'express';

import * as orderRoutes from '../controllers/order.controller';
import * as paymentRoutes from '../controllers/payment.controller';
import { authenticationToken, authorization } from '../middlewares';
import { orderValidation } from '../validations';
import { validate } from '../middlewares';
import { checkBill } from '../middlewares';
const router = express.Router();

//get exits orders
router
    .route('/')
    .get(authenticationToken, authorization.checkAdminRole, orderRoutes.getItemsByQueries);
//get deleted orders
router
    .route('/deleted')
    .get(authenticationToken, authorization.checkAdminRole, orderRoutes.getItemsDeleted);
router
    .route('/restore/:id')
    .get(authenticationToken, authorization.checkAdminRole,orderRoutes.restoreById);
router
    .route('/count-revenue')
    .get(authenticationToken, authorization.checkAdminRole,orderRoutes.countRevenue);
router
    .route('/count-order-status')
    .get(authenticationToken, authorization.checkAdminRole,orderRoutes.countOrderStatus);
router
    .route('/get-by-email-or-phone')
    .post(validate(orderValidation.getOrderByEmailOrPhone), orderRoutes.getByEmailOrPhone);
router
    .route('/')
    .post(authenticationToken, authorization.checkMemberRole, validate(orderValidation.createOrder), checkBill, orderRoutes.create, paymentRoutes.createPaymentUrl);
router
    .route('/:id')
    .get(authenticationToken, authorization.checkMemberRole,validate(orderValidation.getOrder), orderRoutes.getById);
router
    .route('/:id')
    .put(authenticationToken, authorization.checkAdminRole, validate(orderValidation.updateOrder), orderRoutes.updateById);
router
    .route('/:id')
    .delete(authenticationToken, authorization.checkAdminRole, validate(orderValidation.deleteOrder), orderRoutes.deleteById);
router
    .route('/delete-force/:id')
    .delete(authenticationToken, authorization.checkAdminRole, validate(orderValidation.deleteOrder), orderRoutes.deleteForceById);

export default router;
