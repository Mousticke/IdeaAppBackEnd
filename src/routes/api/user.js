/* eslint-disable max-len */
import express from 'express';
import passport from 'passport';
import userSettingsRoute from './userSettings';
import {validateBody, UserRegisterSchemaValidation, UserLoginSchemaValidation, UserInformationSchemaValidation} from '../../helpers/inputValidation';
import {createUser, getAllUsers, getUserById, loginUser, updateUser} from '../../controllers/userController';

const router = new express.Router();

router.use('/:id/settings', passport.authenticate('jwt', {session: false}), userSettingsRoute);

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/register', validateBody(UserRegisterSchemaValidation), createUser);

router.post('/login', validateBody(UserLoginSchemaValidation), passport.authenticate('local', {session: false}), loginUser);

router.patch('/:id', validateBody(UserInformationSchemaValidation), passport.authenticate('jwt', {session: false}), updateUser);

export default router;
