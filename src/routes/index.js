import express from 'express';
import baseRoute from './api';
import userRoute from './api/user';

const router = express.Router();

router.use('/', baseRoute); 
router.use('/users', userRoute); 


export default router;