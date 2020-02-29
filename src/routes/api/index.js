import express from 'express';
import _ from 'lodash';
import ResponseObject from '../../helpers/response';

const router = express.Router();


router.get('/', (req, res, next) => {
    let responseObject = new ResponseObject(
        200, 
        "Welcome to base route", 
        _.get(req, "originalUrl", "Cannot retrieve api url"),
        "GET"
        )
        return responseObject.returnResponseData(true)(res)
});

export default router;