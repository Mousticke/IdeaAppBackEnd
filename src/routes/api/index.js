import express from 'express';
import _ from 'lodash';
import ResponseObject from '../../helpers/response';

const router = express.Router();


router.get('/', (req, res, next) => {
    try {
        let responseObject = new ResponseObject(200,{message: "Welcome to base route"},  _.get(req, "originalUrl", "Cannot retrieve api url"))
        res.send(responseObject.returnResponse(true)).status(responseObject.responseCode);
    } catch (error) {
        let responseObject = new ResponseObject(400,_.get(error,"message", "Bad request occurred"), _.get(req, "originalUrl", "Cannot retrieve api url"))
        res.send(responseObject.returnResponse(false)).status(responseObject.responseCode);
    }
    
});

export default router;