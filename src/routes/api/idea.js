/* eslint-disable max-len */
import express from 'express';
import passport from 'passport';
import {validateBody, IdeaSchemaValidation} from '../../helpers/inputValidation';
import IdeaController from '../../controllers/ideaController';
import IdeaService from '../../services/ideaService';
import UserService from '../../services/userService';

const router = new express.Router();
const authenticateRouteJWT = passport.authenticate('jwt', {session: false});

const ideaService = new IdeaService();
const userService = new UserService();
const ideaController = new IdeaController(ideaService, userService);

const getAllIdeas = async (req, res, next) => ideaController.getAllIdeas(req, res, next);
const getIdea = async (req, res, next) => ideaController.getIdea(req, res, next);
const getAllIdeasFromUser = async (req, res, next) => ideaController.getAllIdeasFromUser(req, res, next);
const createIdea = async (req, res, next) => ideaController.createIdea(req, res, next);
const updateIdea = async (req, res, next) => ideaController.updateIdea(req, res, next);
const deleteIdea = async (req, res, next) => ideaController.deleteIdea(req, res, next);


const validateIdeaBody = validateBody(IdeaSchemaValidation);

router.get('/', getAllIdeas);

router.get('/:id', getIdea);

router.get('/users/:idUser', getAllIdeasFromUser);

router.post('/user/:idUser', validateIdeaBody, authenticateRouteJWT, createIdea);

router.patch('/:id/user/:idUser', validateIdeaBody, authenticateRouteJWT, updateIdea);

router.delete('/:id/user/:idUser', authenticateRouteJWT, deleteIdea);

export default router;
