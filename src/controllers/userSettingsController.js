import _ from 'lodash';
import Controller from './baseController';
import * as HTTPStatus from 'http-status-codes';
import {validateUserID} from '../helpers/inputValidation';
require('express-async-errors');


/**
 * User settings controller
 *
 * @export
 * @class UserSettingsController
 * @extends {Controller}
 */
export default class UserSettingsController extends Controller {
    /**
     *Creates an instance of UserSettingsController.
     * @param {*} service
     * @memberof UserSettingsController
     */
    constructor(service) {
        super(service);
    }

    /**
     * Get User settings
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof UserSettingsController
     */
    async getUserSettings(req, res, next) {
        this.apiInformation(req);
        validateUserID(req.user._id, req.params.id,
            'The user ID does not match the subject in the access token');
        const idUser = _.get(req, 'user._id', '');
        const userSettings = await this.service.findUserSettings(idUser);

        return this.callResponseObject(HTTPStatus.OK, userSettings,
            this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Update user settings for the logged in user
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof UserSettingsController
     */
    async updateUserSettings(req, res, next) {
        const idSettings = _.get(req, 'params.idSettings');
        const idUser = _.get(req, 'params.id');
        const settingsDTO = _.get(req, 'body', '');
        this.apiInformation(req);
        const findSetting = await this.service.findByIdSetting(idSettings);

        validateUserID(req.user._id, req.params.id,
            'The user ID does not match the subject in the access token');
        validateUserID(req.user._id, findSetting.userID._id,
            'This settings does not belong to this user');

        const settingsUpdate = await this.service
            .updateUserSettings(settingsDTO, idSettings, idUser);

        return this.callResponseObject(HTTPStatus.OK, settingsUpdate,
            this.apiRoute, this.apiMethod, true, res);
    }
}
