import express from 'express';
import baseRoute from './api';
import userRoute from './api/user';
import ideaRoute from './api/idea';

const router = new express.Router();

router.use('/', baseRoute);
router.use('/users', userRoute);
router.use('/ideas', ideaRoute);


export default router;
