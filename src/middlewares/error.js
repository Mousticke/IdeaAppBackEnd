import * as HTTPStatus from 'http-status-codes';
import _ from 'lodash';
import ResponseObject from '../helpers/response/response';
import ValidationError from '../helpers/response/validation.error';
import NotFoundError from '../helpers/response/notFound.error';
import UnauthorizedError from '../helpers/response/unauthorized.error';
import ExistingError from '../helpers/response/existing.error';
import BadRequestError from '../helpers/response/badRequest.error';

const baseResponse = (httpCode, apiRoute, method) => {
    return new ResponseObject(httpCode, null, apiRoute, method);
};

const handleRouteNotFound = (req, res, next) => {
    const err = new Error('Route Not Found');
    err.status = HTTPStatus.NOT_FOUND;
    next(err);
};

const handleNotFoundError = (error, req, res, next) => {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof NotFoundError) {
        return baseResponse(HTTPStatus.NOT_FOUND, apiRoute, apiMethod)
            .constructResponse(
                {
                    message: error.message,
                    stack: error.stack,
                },
                false, res);
    }
    next(error);
};

const handleExistingError = (error, req, res, next) => {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof ExistingError) {
        return baseResponse(HTTPStatus.CONFLICT, apiRoute, apiMethod)
            .constructResponse(
                {
                    message: error.message,
                    stack: error.stack,
                },
                false, res);
    }
    next(error);
};

const handleUnauthorizedError = (error, req, res, next) => {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof UnauthorizedError) {
        return baseResponse(HTTPStatus.UNAUTHORIZED, apiRoute, apiMethod)
            .constructResponse(
                {
                    message: error.message,
                    stack: error.stack,
                },
                false, res);
    }
    next(error);
};

const handleBadRequestError = (error, req, res, next) => {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof BadRequestError) {
        return baseResponse(HTTPStatus.BAD_REQUEST, apiRoute, apiMethod)
            .constructResponse(
                {
                    message: error.message,
                    stack: error.stack,
                },
                false, res);
    }
    next(error);
};

const handleValidationError = (error, req, res, next) => {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (error instanceof ValidationError) {
        return baseResponse(HTTPStatus.BAD_REQUEST, apiRoute, apiMethod)
            .constructResponse(
                {
                    message: error.message,
                    validationErrors: error.validationErrors,
                    stack: error.stack,
                },
                false, res);
    }
    next(error);
};

const internalError = (error, req, res, next) => {
    const apiRoute = _.get(req, 'originalUrl', '');
    const apiMethod = _.get(req, 'method', '');
    if (res.headerSent) {
        return next(error);
    } else {
        return baseResponse(
            HTTPStatus.INTERNAL_SERVER_ERROR,
            apiRoute,
            apiMethod)
            .constructResponse(
                {
                    message: error.message,
                    stack: error.stack,
                },
                false, res);
    }
};

export {
    handleRouteNotFound,
    handleNotFoundError,
    handleExistingError,
    handleUnauthorizedError,
    handleBadRequestError,
    handleValidationError,
    internalError,
};
