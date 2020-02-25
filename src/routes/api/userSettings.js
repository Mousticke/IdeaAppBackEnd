import express from 'express';
import _ from 'lodash';
import ResponseObject from '../../helpers/response';
import { UserSetting } from "../../Models/User/userSettingModel";
import passportConf from '../../helpers/authToken'

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
    let responseObject;
    const userSettings = await UserSetting.findOne({userID: req.user._id}).populate('userID', '-password');
    responseObject = new ResponseObject(
        200,
        { userSettings: userSettings },
        _.get(req, "originalUrl", "Cannot retrieve api url")
    );
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
});

export default router;