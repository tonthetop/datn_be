// import accountRoute from './account.route';
import discountRoute from './discount.route';
import accountRoute from './account.route';
import siteRoute from './site.route';
import authRoute from './auth.route'
import productRoute from './product.route';
import express from 'express';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/product/',
    route: productRoute,
  },
  {
    path: '/auth/',
    route: authRoute,
  },
  {
    path: '/account/',
    route: accountRoute,
  },
  {
    path: '/discount/',
    route: discountRoute,
  },
  {
    path: '/',
    route: siteRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
