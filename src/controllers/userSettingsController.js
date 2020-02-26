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

export const updateUserSettings = async(req, res, next) => {
    const userSettings = new UserSetting(_.get(req, "body"));
    const {themeName, newsletter, avatar} = userSettings
    try {
        await UserSetting.replaceOne({ _id: req.params.idSettings, userID: req.params.id }, { themeName, newsletter, avatar }, { multi: false });
    } catch (error) {
        const responseObject = constructResponse(400, error, _.get(req, "originalUrl", ""), "PUT")
        return responseObject.returnAPIResponse(res, false)
    }
    const responseObject = constructResponse(200, {themeName, newsletter, avatar}, _.get(req, "originalUrl", ""), "PUT")
    return responseObject.returnAPIResponse(res, true)

}