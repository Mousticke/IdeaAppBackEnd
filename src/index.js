/* eslint-disable max-len */
import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import _ from 'lodash';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import * as HTTPStatus from 'http-status-codes';
import compression from 'compression';
import api from './routes';
import {connectMongoDB, closeMongoDB} from './config/database/mongoDB';
import ResponseObject from './helpers/response/response';
import ValidationError from './helpers/response/validation.error';
import NotFoundError from './helpers/response/notFound.error';
import UnauthorizedError from './helpers/response/unauthorized.error';
import ExistingError from './helpers/response/existing.error';
import BadRequestError from './helpers/response/badRequest.error';
require('express-async-errors');

dotenv.config();
const app = express();
const router = new express.Router();
let mongoDBConnect;

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

const baseResponse = (httpCode, apiRoute, method) => {
    return new ResponseObject(httpCode, null, apiRoute, method);
};

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


app.use('/api/v1', api);
app.use(redirectHome);


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = HTTPStatus.NOT_FOUND;
    next(err);
});

app.use(function handleNotFoundError(error, req, res, next) {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof NotFoundError) {
        return baseResponse(HTTPStatus.NOT_FOUND, apiRoute, apiMethod)
            .constructResponse({message: error.message, stack: error.stack}, false, res);
    }
    next(error);
});

app.use(function handleExistingError(error, req, res, next) {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof ExistingError) {
        return baseResponse(HTTPStatus.CONFLICT, apiRoute, apiMethod)
            .constructResponse({message: error.message, stack: error.stack}, false, res);
    }
    next(error);
});

app.use(function handleUnauthorizedError(error, req, res, next) {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof UnauthorizedError) {
        return baseResponse(HTTPStatus.UNAUTHORIZED, apiRoute, apiMethod)
            .constructResponse({message: error.message, stack: error.stack}, false, res);
    }
    next(error);
});

app.use(function handleBadRequestError(error, req, res, next) {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof BadRequestError) {
        return baseResponse(HTTPStatus.BAD_REQUEST, apiRoute, apiMethod)
            .constructResponse({message: error.message, stack: error.stack}, false, res);
    }
    next(error);
});


app.use(function handleValidationError(error, req, res, next) {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof ValidationError) {
        return baseResponse(HTTPStatus.BAD_REQUEST, apiRoute, apiMethod)
            .constructResponse({message: error.message, validationErrors: error.validationErrors, stack: error.stack}, false, res);
    }
    next(error);
});


/* app.use(function handleDatabaseError(error, req, res, next) {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof DatabaseError) {
        if (error.code = '11000') {
            return baseResponse(HTTPStatus.CONFLICT, apiRoute, apiMethod)
                .constructResponse({message: error.message, type: 'MongoDBError', stack: error.stack}, false, res);
        } else {
            return baseResponse(HTTPStatus.SERVICE_UNAVAILABLE, apiRoute, apiMethod)
                .constructResponse({message: error.message, type: 'MongoDBError', stack: error.stack}, false, res);
        }
    }
    next(error);
});*/


app.use(function(error, req, res, next) {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (res.headerSent) {
        return next(error);
    } else {
        return baseResponse(HTTPStatus.INTERNAL_SERVER_ERROR, apiRoute, apiMethod)
            .constructResponse({message: error.message, stack: error.stack}, false, res);
    }
});


app.listen(process.env.PORT, () => {
    console.debug(`Server host : ${process.env.HOST} started on port ${process.env.PORT || 3000}`);
});

export default app;

