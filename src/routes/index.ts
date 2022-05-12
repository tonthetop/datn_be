// import accountRoute from './account.route';
import discountRoute from './discount.route';
import accountRoute from './account.route';
import siteRoute from './site.route';
import express from 'express';

const router = express.Router();

const defaultRoutes = [
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
