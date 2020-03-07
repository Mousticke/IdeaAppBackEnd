import _ from 'lodash';
import passport from 'passport';
import ResponseObject from '../helpers/response';
import {UserService} from '../services/userService';
import {signToken} from '../helpers/authToken';
import {UserSetting} from '../Models/User/userSettingModel';
import local from '../config/globalization/local.en.json';

const baseResponse = (httpCode, apiRoute, method) => {
    return new ResponseObject(httpCode, null, apiRoute, method);
};

const getApiInfo = (req) => {
    return {
        apiRoute: _.get(req, 'originalUrl'),
        apiMethod: _.get(req, 'method'),
    };
};

const resUser = local.user;
const resGeneral = local.general;

export const getAllUsers = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    const users = await UserService.findAllUser();
    return baseResponse(200, apiRoute, apiMethod)
        .constructResponse(users, true, res);
};

export const getUserById = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    const user = await UserService.findOneUserById(_.get(req, 'params.id'));
    if (!user) {
        return baseResponse(400, apiRoute, apiMethod)
            .constructResponse(resUser.NOT_EXIST, false, res);
    }
    return baseResponse(200, apiRoute, apiMethod)
        .constructResponse(user, true, res);
};

export const createUser = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    const userService = new UserService(_.get(req, 'body'));
    const emailOrUsernameCheckExist = await userService.findOneUser();

    if (emailOrUsernameCheckExist) {
        return baseResponse(400, apiRoute, apiMethod)
            .constructResponse(resUser.EMAIL_USERNAME_EXIST, false, res);
    }
    const savedUser = await userService.createUser();
    savedUser.toJSON();
    const {_id, username, firstname, lastname, email, age} = savedUser;
    const token = signToken(savedUser);

    const userSettings = new UserSetting({userID: savedUser._id});
    const savedDefaultSettings = await userSettings.save();

    return baseResponse(201, apiRoute, apiMethod)
        .constructResponse(
            {
                token, _id, username, firstname, lastname, email, age,
                userSettings: savedDefaultSettings,
            }, true, res);
};

export const loginUser = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return baseResponse(401, apiRoute, apiMethod)
                .constructResponse(
                    {message: _.get(info, 'message', ''), err},
                    false,
                    res,
                );
        } else {
            const {_id, username, firstname, lastname, email, age} = user;
            const token = signToken(user);
            res.header('Authorization', 'Bearer '+ token);

            return baseResponse(200, apiRoute, apiMethod)
                .constructResponse(
                    {token, _id, username, firstname, lastname, email, age},
                    true,
                    res,
                );
        }
    })(req, res);
};

export const updateUser = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    if (req.user._id != req.params.id) {
        return baseResponse(403, apiRoute, apiMethod)
            .constructResponse(resGeneral.UNAUTHORIZED, false, res);
    }
    const repeatPassword = _.get(req, 'body.repeatPassword', '');

    const userService = new UserService(_.get(req, 'body'));

    if (userService.user.password !== repeatPassword) {
        return baseResponse(400, apiRoute, apiMethod)
            .constructResponse(resUser.PASSWORD_UNMATCHED, false, res);
    } else {
        userService.user.password = await userService.user
            .hashPassword(userService.user.password);
    }
    const {_id, username, firstname, lastname, email, age} = userService.user;

    userService.updateUser(req.params.id);

    return baseResponse(200, apiRoute, apiMethod)
        .constructResponse(
            {_id, username, firstname, lastname, email, age},
            true,
            res,
        );
};
