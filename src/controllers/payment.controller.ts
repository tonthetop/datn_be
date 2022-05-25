import config from '../config/payment.json';
import express, { Request, Response, NextFunction } from 'express';
import dateFormat, { masks } from "dateformat";
import { orderService } from '../services';
import * as ErrorCollection from '../errors';
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
export const createPaymentUrl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  let createDate = dateFormat(date, 'yyyymmddHHmmss');
  let orderId = dateFormat(date, 'HHmmss');
  //let amount = req.body.amount;
  //let bankCode = req.body.bankCode;
  // let orderInfo = req.body.orderDescription;
  // let orderType = req.body.orderType;
  //let locale = req.body.language;
  const order = (req as any).order;
  const price = order.productList.reduce(
    (a: any, b: any) => a.amount * a.price + b.amount * b.productService
  );

  let bankCode = 'NCB';
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
  vnp_Params['vnp_OrderInfo'] = `Order_${order._id}`;
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
  res.send(vnpUrl);
};

export const returnPaymentUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let vnp_Params: any = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed && vnp_Params['vnp_ResponseCode'] === '00') {
    const orderInfo = vnp_Params['vnp_OrderInfo'].split('_');
    const orderId = orderInfo.decodeURIComponent(orderInfo[1]);
    const order = await orderService.getById(orderId);
    order.orderStatus.push({
      status: 'ACCEPTED',
      description: 'Đơn hàng đã được chấp nhận',
      createdAt: new Date(),
    });
    order
      .save()
      .then((data: any) => data.dataValues)
      .then((data: any) => {
        return res.send({ data });
        //return res.render('returnPayment');
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message,
        });
      });
  } else {
    next(new ErrorCollection.PaymentError());
  }
};