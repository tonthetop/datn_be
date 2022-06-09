import 'dotenv/config';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';
import routes from './routes';
import morgan from 'morgan';
import methodOverride from 'method-override';
const app = express();

 app.use(cors());
app.use(morgan('combined'));
app.use(methodOverride('_method'));
app.use(json());
//
app.use(routes);
//
app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
