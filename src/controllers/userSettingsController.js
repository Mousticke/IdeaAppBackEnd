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
        return responseObject.returnResponseData(false)(res)
    }
    const userSettings = await UserSetting.findOne({ userID: req.user._id }).populate('userID', '-password');

    const responseObject = constructResponse(200, userSettings, _.get(req, "originalUrl", ""), req.method)
    return responseObject.returnResponseData(true)(res)
}

export const updateUserSettings = async (req, res, next) => {
    if (req.user._id != req.params.id) {
        const responseObject = constructResponse(403, "Unauthorized request for these parameters", _.get(req, "originalUrl", ""), req.method)
        return responseObject.returnResponseData(false)(res)
    }
    const userSettings = new UserSetting(_.get(req, "body"));
    const { themeName, newsletter, avatar } = userSettings
    try {
        await UserSetting.replaceOne({ _id: req.params.idSettings }, { themeName, newsletter, avatar, userID: req.params.id }, { multi: false });
    } catch (error) {
        const responseObject = constructResponse(400, error, _.get(req, "originalUrl", ""), req.method)
        return responseObject.returnResponseData(false)(res)
    }
    const responseObject = constructResponse(200, { themeName, newsletter, avatar }, _.get(req, "originalUrl", ""), req.method)
    return responseObject.returnResponseData(true)(res)

}