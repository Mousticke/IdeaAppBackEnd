/* eslint-disable max-len */
import express from 'express';
import passport from 'passport';
import userSettingsRoute from './userSettings';
import {validateBody, UserRegisterSchemaValidation, UserLoginSchemaValidation, UserInformationSchemaValidation} from '../../helpers/inputValidation';
import {createUser, getAllUsers, getUserById, loginUser, updateUser} from '../../controllers/userController';

const router = new express.Router();
const authenticateRouteJWT = passport.authenticate('jwt', {session: false});
const authenticateRouteLocal = passport.authenticate('local', {session: false});

router.use('/:id/settings', authenticateRouteJWT, userSettingsRoute);

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/register', validateBody(UserRegisterSchemaValidation), createUser);

router.post('/login', validateBody(UserLoginSchemaValidation), authenticateRouteLocal, loginUser);

router.patch('/:id', validateBody(UserInformationSchemaValidation), authenticateRouteJWT, updateUser);

export default router;
