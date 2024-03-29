/* eslint-disable max-len */
import express from 'express';
import passport from 'passport';
import userSettingsRoute from './userSettings';
import {
    validateBody,
    UserRegisterSchemaValidation,
    UserLoginSchemaValidation,
    UserInformationSchemaValidation,
} from '../../helpers/inputValidation';
import UserController from '../../controllers/userController';
import UserService from '../../services/userService';
import UserSettingsService from '../../services/userSettingsService';
import UnauthorizedError from '../../helpers/response/unauthorized.error';
import local from '../../config/globalization/local.en.json';

const router = new express.Router();

const authenticateRouteJWT = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err || !user) {
            throw new UnauthorizedError(
                local.general.UNAUTHORIZED + ' ' + info,
            );
        }
        req.user = user;
        next();
    })(req, res, next);
};

const userService = new UserService();
const userSettingsService = new UserSettingsService();
const userController = new UserController(userService, userSettingsService);

const getAllUsers = async (req, res, next) => userController.getAllUsers(req, res, next);
const getUserById = async (req, res, next) => userController.getUserById(req, res, next);
const updateUser = async (req, res, next) => userController.updateUser(req, res, next);
const createUser = async (req, res, next) => userController.createUser(req, res, next);
const loginUser = async (req, res, next) => userController.loginUser(req, res, next);

const validUserUpdateBody = validateBody(UserInformationSchemaValidation);
const validRegisterBody = validateBody(UserRegisterSchemaValidation);
const validLoginBody = validateBody(UserLoginSchemaValidation);

router
    .use('/:id/settings', authenticateRouteJWT, userSettingsRoute);

router
    .get('/', getAllUsers);

router
    .route('/:id')
    .get(getUserById)
    .patch(validUserUpdateBody, authenticateRouteJWT, updateUser); ;

router
    .post('/register', validRegisterBody, createUser);

router
    .post('/login', validLoginBody, loginUser);

router;

export default router;
