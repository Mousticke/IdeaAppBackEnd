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
               _.get(error, "details", {}),
                _.get(req, "originalUrl", "Cannot retrieve api url")
            );
            return res.status(responseObject.responseCode).send(responseObject)
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

export {validateBody, UserRegisterSchemaValidation, UserLoginSchemaValidation}