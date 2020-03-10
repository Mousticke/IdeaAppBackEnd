import _ from 'lodash';
import ResponseObject from '../helpers/response/response';
import local from '../config/globalization/local.en.json';
import {UserSettingsService} from '../services/userSettingsService';


const baseResponse = (httpCode, apiRoute, method) => {
    return new ResponseObject(httpCode, null, apiRoute, method);
};

const getApiInfo = (req) => {
    return {
        apiRoute: _.get(req, 'originalUrl'),
        apiMethod: _.get(req, 'method'),
    };
};

const resGeneral = local.general;

export const getUserSettings = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    if (req.user._id != req.params.id) {
        return baseResponse(403, apiRoute, apiMethod)
            .constructResponse(resGeneral.UNAUTHORIZED, false, res);
    }
    const idUser = _.get(req, 'user._id', '');
    const userSettings = await UserSettingsService.findUserSettings(idUser);

    return baseResponse(200, apiRoute, apiMethod)
        .constructResponse(userSettings, true, res);
};

export const updateUserSettings = async (req, res, next) => {
    const idSettings = _.get(req, 'params.idSettings');
    const idUser = _.get(req, 'params.id');
    const {apiRoute, apiMethod} = getApiInfo(req);
    const findSetting = await UserSettingsService.findByIdSetting(idSettings);
    if (findSetting === null) {
        return baseResponse(400, apiRoute, apiMethod)
            .constructResponse(resGeneral.BAD_REQUEST, false, res);
    }
    if (req.user._id != req.params.id ||
        findSetting.userID._id.toString() != req.user._id.toString()) {
        return baseResponse(403, apiRoute, apiMethod)
            .constructResponse(resGeneral.UNAUTHORIZED, false, res);
    }
    const userSettingsService = new UserSettingsService(_.get(req, 'body'));
    const {themeName, newsletter, avatar} = userSettingsService.settings;

    await userSettingsService.updateUserSettings(idSettings, idUser);

    return baseResponse(200, apiRoute, apiMethod)
        .constructResponse(
            {themeName, newsletter, avatar, userID: req.params.id},
            true,
            res,
        );
};
