import express from 'express';
import {getUserSettings, updateUserSettings} from '../../controllers/userSettingsController'

const router = express.Router({ mergeParams: true });

router.get('/', getUserSettings);

router.put('/:idSettings', updateUserSettings);

export default router;