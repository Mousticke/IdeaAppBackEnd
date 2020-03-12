/* eslint-disable max-len */
import express from 'express';
import UserSettingsController from '../../controllers/userSettingsController';
import UserSettingsService from '../../services/userSettingsService';

const router = new express.Router({mergeParams: true});

const userSettingsService = new UserSettingsService();
const userSettingsController = new UserSettingsController(userSettingsService);

const getUserSettings = async (req, res, next) => userSettingsController.getUserSettings(req, res, next);
const updateUserSettings = async (req, res, next) => userSettingsController.updateUserSettings(req, res, next);

router.get('/', getUserSettings);

router.patch('/:idSettings', updateUserSettings);

export default router;
