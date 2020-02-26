import express from 'express';
import {getUserSettings} from '../../controllers/userSettingsController'

const router = express.Router({ mergeParams: true });

router.get('/', getUserSettings);

export default router;