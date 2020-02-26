import _ from 'lodash';
import ResponseObject from '../helpers/response';
import { UserSetting } from "../Models/User/userSettingModel";

const constructResponse = (httpCode, data, originURL, method) => {
    return new ResponseObject(
        httpCode,
        data,
        originURL,
        method
    );
}

export const getUserSettings = async (req, res, next) => {
    const userSettings = await UserSetting.findOne({userID: req.user._id}).populate('userID', '-password');
    
    const responseObject = constructResponse(200, userSettings, _.get(req, "originalUrl", ""), "GET")
    return responseObject.returnAPIResponse(res, true)
}