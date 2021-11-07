/* eslint-disable max-len */
import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import _ from 'lodash';
import api from './routes';
import {connectMongoDB, closeMongoDB} from './config/database/mongoDB';
import {
    handleRouteNotFound,
    handleNotFoundError,
    handleExistingError,
    handleUnauthorizedError,
    handleBadRequestError,
    handleValidationError,
    internalError,
} from './middlewares/error';
require('express-async-errors');
const rateLimit = require('express-rate-limit');


dotenv.config();
const app = express();
const router = new express.Router();
let mongoDBConnect;

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});

switch (process.env.NODE_ENV) {
case 'development':
    mongoDBConnect = `${process.env.REMOTE_DB_HOST_DEV}`;
    break;

case 'test':
    mongoDBConnect = `${process.env.REMOTE_DB_HOST_TEST}`;
    break;

case 'production':
    mongoDBConnect = `${process.env.REMOTE_DB_HOST_PROD}`;
    break;

default:
    mongoDBConnect = `${process.env.REMOTE_DB_HOST_DEV}`;
    break;
}

connectMongoDB(mongoDBConnect)
    .catch((error) => {
        console.error(error);
        closeMongoDB();
    });

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ // Middleware
    extended: true,
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(passport.initialize());

const redirectHome = (req, res, next) => {
    if (_.get(req, 'originalUrl') == '/') {
        res.redirect('/api/v1');
    }
    next();
};

router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

app.use(apiLimiter);
app.use('/api/v1', api);
app.use(redirectHome);

app.use(handleRouteNotFound);
app.use(handleNotFoundError);
app.use(handleExistingError);
app.use(handleUnauthorizedError);
app.use(handleBadRequestError);
app.use(handleValidationError);
app.use(internalError);


app.listen(process.env.PORT, () => {
    console.debug(`Server host : ${process.env.HOST} started on port ${process.env.PORT || 3000}`);
});

export default app;

