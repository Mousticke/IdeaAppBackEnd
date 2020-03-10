import Joi from '@hapi/joi';
import _ from 'lodash';
import UnauthorizedError from './response/unauthorized.error';
import ValidationError from './response/validation.error';
import BadRequestError from './response/badRequest.error';


export const validateUserID = (req) => {
    if (req.user._id != req.params.id) {
        throw new UnauthorizedError(
            'The user ID does not match the subject in the access token',
        );
    }
};

export const validateMatchPassword = (password, confPassword, errMessage) => {
    if (password !== confPassword) {
        throw new BadRequestError(errMessage);
    }
};

export const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(_.get(req, 'body'));
        const {error} = result;
        if (error) {
            throw new ValidationError(
                'Invalid Body',
                _.get(error, 'details')[0],
            );
        }
        return next();
    };
};

export const UserRegisterSchemaValidation = Joi.object({
    username: Joi.string().min(4).required(),
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    age: Joi.date(),
});


export const UserLoginSchemaValidation = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string().min(6).required(),
});

export const UserInformationSchemaValidation = Joi.object({
    username: Joi.string().min(4).required(),
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.string().min(6).required(),
    age: Joi.date(),
});

export const IdeaSchemaValidation = Joi.object({
    title: Joi.string().min(4).max(256).required(),
    details: Joi.string().min(4).max(10000).required(),
    summary: Joi.string().min(4).max(1024),
});

