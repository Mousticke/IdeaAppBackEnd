import express from 'express';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import ResponseObject from '../../helpers/response';
import { UserSetting } from "../../Models/User/userSettingModel";
import { authToken } from '../../helpers/verifyToken';

const router = express.Router({ mergeParams: true });

router.get('/', authToken, async (req, res, next) => {
    let responseObject;
    try {
        jwt.verify(_.get(req, "token"), process.env.JWT_TOKEN, (err) => {
            if (err) {
                responseObject = new ResponseObject(401,{ error: err },_.get(req, "originalUrl", "Cannot retrieve api url"));
                return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
            }
        });
        let userIDFind = { userID: _.get(req, "params.id") }
        const userSettings = await UserSetting.findOne(userIDFind).populate('userID');
        responseObject = new ResponseObject(
            200,
            { userSettings: userSettings, token: _.get(req, "token") },
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
    } catch (error) {
        responseObject = new ResponseObject(400, { error: error }, _.get(req, "originalUrl", "Cannot retrieve api url"))
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
    }
});

export default router;