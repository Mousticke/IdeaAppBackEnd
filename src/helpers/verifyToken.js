import jwt from 'jsonwebtoken';
import _ from 'lodash';
import ResponseObject from "./response";

const authToken = (req, res, next) => {
    let responseObject;
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        responseObject = new ResponseObject(401, {error: "Access Denied"}, _.get(req, "originalUrl", "Cannot retrieve api url"))
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
    } 
}

export {authToken}