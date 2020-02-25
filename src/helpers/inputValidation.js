import Joi from '@hapi/joi';
import _ from "lodash";
import ResponseObject from "./response";


const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(_.get(req, "body"))
        const {error} = result
        if(error){
            let responseObject = new ResponseObject(
                400,
               {error: _.get(error, "details")[0]},
                _.get(req, "originalUrl", "Cannot retrieve api url")
            );
            return res.status(responseObject.responseCode).send(responseObject.returnResponse(false))
        }
        return next();
    }
}

const UserRegisterSchemaValidation = Joi.object({
    username: Joi.string().min(4).required(),
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    age: Joi.date()
});


const UserLoginSchemaValidation = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string().min(6).required(),
});

const UserInformationSchemaValidation = Joi.object({
    username: Joi.string().min(4).required(),
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.string().min(6).required(),
    age: Joi.date()
});

export {validateBody, UserRegisterSchemaValidation, UserLoginSchemaValidation, UserInformationSchemaValidation}