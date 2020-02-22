import express from 'express';
import _ from 'lodash';
import ResponseObject from '../../helpers/response';

const router = express.Router();


router.get('/', (req, res, next) => {
    try {
        let responseObject = new ResponseObject(200,{message: "Welcome to base route"},  _.get(req, "originalUrl", "Cannot retrieve api url"))
        res.send(responseObject.returnResponse(true)).status(200);
    } catch (error) {
        let responseObject = new ResponseObject(500,_.get(error,"message", "Error occurred"), _.get(req, "originalUrl", "Cannot retrieve api url"))
        res.send(responseObject.returnResponse(false)).status(500);
    }
    
});

export default router;