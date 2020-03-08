/* eslint-disable max-len */
import express from 'express';
import passport from 'passport';
import {validateBody, IdeaSchemaValidation} from '../../helpers/inputValidation';
import {getAllIdeas, getIdea, getAllIdeasFromUser, createIdea, deleteIdea, updateIdea} from '../../controllers/ideaController';

const router = new express.Router();
const authenticateRouteJWT = passport.authenticate('jwt', {session: false});

router.get('/', getAllIdeas);

router.get('/:id', getIdea);

router.get('/users/:idUser', getAllIdeasFromUser);

router.post('/user/:idUser', validateBody(IdeaSchemaValidation), authenticateRouteJWT, createIdea);

router.patch('/:id/user/:idUser', validateBody(IdeaSchemaValidation), authenticateRouteJWT, updateIdea);

router.delete('/:id/user/:idUser', authenticateRouteJWT, deleteIdea);

export default router;
