import express from 'express';
import _ from 'lodash';
import ResponseObject from '../../helpers/response';
import { UserSetting } from "../../Models/User/userSettingModel";

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
    try {
        let userSettingFind = {userID: _.get(req, "params.id")}
        const userSettings = await UserSetting.findOne(userSettingFind).populate('userID');
        let responseObject = new ResponseObject(
            200,
            { userSettings: userSettings },
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        return res.send(responseObject.returnResponse(true)).status(responseObject.responseCode);
    } catch (error) {
        let responseObject = new ResponseObject(
            400,
            _.get(error, "message", "Bad Request"),
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        res.send(responseObject.returnResponse(false)).status(responseObject.responseCode);
    }
});

export default router;