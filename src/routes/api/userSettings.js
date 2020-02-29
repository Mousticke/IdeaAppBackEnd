/* eslint-disable max-len */
import express from 'express';
import {getUserSettings, updateUserSettings} from '../../controllers/userSettingsController';

const router = new express.Router({mergeParams: true});

router.get('/', getUserSettings);

router.patch('/:idSettings', updateUserSettings);

export default router;
