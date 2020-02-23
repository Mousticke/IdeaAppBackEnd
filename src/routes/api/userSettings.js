import express from 'express';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import ResponseObject from '../../helpers/response';
import { UserSetting } from "../../Models/User/userSettingModel";
import { authToken } from '../../helpers/verifyToken';

const router = express.Router({ mergeParams: true });

router.get('/', authToken, async (req, res, next) => {
    let responseObject;
    let userIDFind = { userID: _.get(req, "params.id") }
    const userSettings = await UserSetting.findOne(userIDFind).populate('userID');
    responseObject = new ResponseObject(
        200,
        { userSettings: userSettings, token: _.get(req, "token") },
        _.get(req, "originalUrl", "Cannot retrieve api url")
    );
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
});

export default router;