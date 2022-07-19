import config from '../config/payment.json';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import crypto from 'crypto';
import { orderService } from '../services';
import { catchAsync } from '../utils';
import createError from 'http-errors';
import httpStatus from 'http-status';
function sortObject(obj: any) {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
export const createPaymentUrl = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;

  let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;
  let vnpUrl = config.vnp_Url;
  //
  let returnUrl = 'http://' + req.headers.host + config.vnp_ReturnUrl;
  //
  let date = new Date();

  let createDate = moment(date).format('yyyyMMDDHHmmss');
  let orderId = moment(date).format('HHmmss');
  //let amount = req.body.amount;
  let bankCode = req.body.bankCode;
  // let orderInfo = req.body.orderDescription;
  // let orderType = req.body.orderType;
  //let locale = req.body.language;
  const order = (req as any).order;
  const price = order.productList.reduce(
    (acc: number, obj: any) => acc + obj.amount * obj.price,
    0
  );
  let locale = 'vn';
  if (locale === null || locale === '') {
    locale = 'vn';
  }
  let currCode = 'VND';
  let vnp_Params: any = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  //
  vnp_Params['vnp_OrderInfo'] = `Bill Payment for Order_${order._id}`;
  vnp_Params['vnp_OrderType'] = 'billpayment';
  vnp_Params['vnp_Amount'] = price * 100;
  //
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  res.status(httpStatus.CREATED).send(vnpUrl);
});

export const returnPaymentUrl = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('returnPaymentUrl');
  let vnp_Params: any = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed && vnp_Params['vnp_ResponseCode'] === '00') {
    const orderInfo = vnp_Params['vnp_OrderInfo'].split('_');
    const orderId = decodeURIComponent(orderInfo[1]);
    const order = await orderService.getById(orderId);

    if (order.orderStatus[1]) {
      throw new createError.BadRequest('Đơn hàng này đã được xử lý');
    }
    order.orderStatus.push({
      status: 'ACCEPTED',
      description: 'Đơn hàng đã được chấp nhận',
      createdAt: new Date(),
    });
    order.save();
        return res.redirect(`https://datn-fe-flame.vercel.app/thankyou/${order._id}`);
    //return res.redirect(`http://localhost:3000/thankyou/${order._id}`);
  } else {
    throw new createError.PaymentRequired();
  }
});
