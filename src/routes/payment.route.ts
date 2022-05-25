import express from "express";
import * as paymentRoutes from '../controllers/payment.controller'

const router = express.Router();
router.route("/vnpay_return").get(paymentRoutes.returnPaymentUrl);

export default router;
