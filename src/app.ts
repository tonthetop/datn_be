import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';
import routes from './routes'
var morgan = require('morgan')

const app = express();

app.use(morgan("combined"))

app.use(cors());
app.use(json());
//
app.use(routes)
//
app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
