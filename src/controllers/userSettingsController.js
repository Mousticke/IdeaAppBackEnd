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
    if (req.user._id != req.params.id) {
        const responseObject = constructResponse(403, "Unauthorized request for these parameters", _.get(req, "originalUrl", ""), "GET")
        return responseObject.returnAPIResponse(res, false)
    }
    const userSettings = await UserSetting.findOne({ userID: req.user._id }).populate('userID', '-password');

    const responseObject = constructResponse(200, userSettings, _.get(req, "originalUrl", ""), "GET")
    return responseObject.returnAPIResponse(res, true)
}

export const updateUserSettings = async (req, res, next) => {
    if (req.user._id != req.params.id) {
        const responseObject = constructResponse(403, "Unauthorized request for these parameters", _.get(req, "originalUrl", ""), "GET")
        return responseObject.returnAPIResponse(res, false)
    }
    const userSettings = new UserSetting(_.get(req, "body"));
    const { themeName, newsletter, avatar } = userSettings
    try {
        await UserSetting.replaceOne({ _id: req.params.idSettings }, { themeName, newsletter, avatar, userID: req.params.id }, { multi: false });
    } catch (error) {
        const responseObject = constructResponse(400, error, _.get(req, "originalUrl", ""), "PUT")
        return responseObject.returnAPIResponse(res, false)
    }
    const responseObject = constructResponse(200, { themeName, newsletter, avatar }, _.get(req, "originalUrl", ""), "PUT")
    return responseObject.returnAPIResponse(res, true)

}