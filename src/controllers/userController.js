import bcrypt from 'bcryptjs';
import _ from 'lodash';
import ResponseObject from '../helpers/response';
import {User} from '../Models/User/userModel';
import {signToken} from '../helpers/authToken';
import {UserSetting} from '../Models/User/userSettingModel';

const constructResponse = (httpCode, data, originURL, method) => {
  return new ResponseObject(
      httpCode,
      data,
      originURL,
      method,
  );
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-__v -password');
    const responseObject = constructResponse(
        200,
        users,
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(true)(res);
  } catch (error) {
    const responseObject = constructResponse(
        500,
        error,
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(false)(res);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(
        _.get(req, 'params.id'))
        .select('-__v -password');
    if (!user) {
      const responseObject = constructResponse(
          400,
          'User does not exist',
          _.get(req, 'originalUrl', ''),
          req.method);
      return responseObject.returnResponseData(false)(res);
    }
    const responseObject = constructResponse(200,
        user,
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(true)(res);
  } catch (error) {
    const responseObject = constructResponse(500,
        error,
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(false)(res);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = new User(_.get(req, 'body'));
    const emailOrUsernameCheckExist = await User.findOne({
      $or: [
        {email: user.email},
        {username: user.username},
      ],
    });

    if (emailOrUsernameCheckExist) {
      const responseObject = constructResponse(
          400,
          'Email or Username already exist',
          _.get(req, 'originalUrl', ''),
          req.method);
      return responseObject.returnResponseData(false)(res);
    }

    const savedUser = await user.save();
    savedUser.toJSON();
    const {_id, username, firstname, lastname, email, age} = savedUser;
    const token = signToken(savedUser);

    const userSettings = new UserSetting({userID: savedUser._id});
    const savedDefaultSettings = await userSettings.save();

    const responseObject = constructResponse(
        201,
        {
          token, _id, username, firstname, lastname, email, age,
          userSettings: savedDefaultSettings,
        },
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(true)(res);
  } catch (error) {
    const responseObject = constructResponse(
        500,
        error,
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(false)(res);
  }
};

export const loginUser = async (req, res, next) => {
  const {_id, username, firstname, lastname, email, age} = req.user;
  const token = signToken(req.user);

  const responseObject = constructResponse(
      200,
      {token, _id, username, firstname, lastname, email, age},
      _.get(req, 'originalUrl', ''),
      req.method);
  return responseObject.returnResponseData(true)(res);
};

export const updateUser = async (req, res, next) => {
  if (req.user._id != req.params.id) {
    const responseObject = constructResponse(
        403,
        'Unauthorized request for these parameters',
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(false)(res);
  }
  const repeatPassword = _.get(req, 'body.repeatPassword', '');

  const user = new User(_.get(req, 'body'));

  if (user.password !== repeatPassword) {
    const responseObject = constructResponse(
        400,
        'Password does not match',
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(false)(res);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  const {_id, username, firstname, lastname, email, age, password} = user;
  try {
    await User.replaceOne(
        {_id: req.params.id},
        {username, firstname, lastname, email, age, password},
        {multi: false});
  } catch (error) {
    const responseObject = constructResponse(
        400,
        error,
        _.get(req, 'originalUrl', ''),
        req.method);
    return responseObject.returnResponseData(false)(res);
  }
  const responseObject = constructResponse(
      200,
      {_id, username, firstname, lastname, email, age},
      _.get(req, 'originalUrl', ''),
      req.method);
  return responseObject.returnResponseData(true)(res);
};
