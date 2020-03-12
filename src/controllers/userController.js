import _ from 'lodash';
import passport from 'passport';
import * as HTTPStatus from 'http-status-codes';
import {signToken} from '../helpers/authToken';
import {UserSetting} from '../Models/User/userSettingModel';
import local from '../config/globalization/local.en.json';
import {validateUserID,
    validateMatchPassword} from '../helpers/inputValidation';
import Controller from './baseController';
require('express-async-errors');

const resUser = local.user;


/**
 * User controller for user route
 *
 * @class UserController
 * @extends {Controller}
 */
export default class UserController extends Controller {
    /**
    *Creates an instance of UserController.
    * @param {*} service
    * @memberof UserController
    */
    constructor(service) {
        super(service);
    }

    /**
     *Get All users
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof UserController
     */
    async getAllUsers(req, res, next) {
        this.apiInformation(req);
        const users = await this.service.findAllUser();
        return this.callResponseObject(HTTPStatus.OK, users,
            this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Get an user based on its ID
     * If the user is not found, return a not found exception
     * Code 404. Otherwise return user base information.
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof UserController
     */
    async getUserById(req, res, next) {
        this.apiInformation(req);
        const user = await this.service
            .findOneUserById(_.get(req, 'params.id'));

        return this.callResponseObject(HTTPStatus.OK, user,
            this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Create a user in database.
     * If the user or email exists, return an existing error exception
     * Code 409. Otherwise, create a token and login the user
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof UserController
     */
    async createUser(req, res, next) {
        this.apiInformation(req);
        await this.service.findIfOneUserExists(_.get(req, 'body'));

        const savedUser = await this.service.createUser(_.get(req, 'body'));
        savedUser.toJSON();
        const {_id, username, firstname, lastname, email, age} = savedUser;
        const token = signToken(savedUser);

        const userSettings = new UserSetting({userID: savedUser._id});
        const savedDefaultSettings = await userSettings.save();

        return this.callResponseObject(HTTPStatus.CREATED, {
            token, _id, username, firstname, lastname, email, age,
            userSettings: savedDefaultSettings,
        },
        this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Login the user. Set username and password
     * If the user is found and the password is correct,
     * create a token. Otherwise, return an unauthorized response
     * provided by passport.
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof UserController
     */
    async loginUser(req, res, next) {
        this.apiInformation(req);
        passport.authenticate('local', {session: false},
            (err, user, info) => {
                if (err || !user) {
                    return this.callResponseObject(HTTPStatus.BAD_REQUEST,
                        {message: _.get(info, 'message', ''), err},
                        this.apiRoute, this.apiMethod, false, res);
                }
                const {_id, username, firstname, lastname, email, age} = user;
                const token = signToken(user);
                res.header('Authorization', 'Bearer '+ token);

                return this.callResponseObject(HTTPStatus.OK,
                    {token, _id, username, firstname, lastname, email, age},
                    this.apiRoute, this.apiMethod, true, res);
            })(req, res);
    }

    /**
     * Update a user based on the id.
     * If the provided id doesn't match the payload's id of tge token
     * return an unauthorized response.
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof UserController
     */
    async updateUser(req, res, next) {
        validateUserID(req.user._id, req.params.id);
        this.apiInformation(req);
        const repeatPassword = _.get(req, 'body.repeatPassword', '');

        validateMatchPassword(_.get(req, 'body.password'),
            repeatPassword, resUser.PASSWORD_UNMATCHED);

        const objectUpdate = await this.service
            .updateUser(req.params.id, _.get(req, 'body'));

        return this.callResponseObject(HTTPStatus.OK,
            objectUpdate,
            this.apiRoute, this.apiMethod, true, res);
    }
}

