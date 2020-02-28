import express from "express";
import passport from 'passport';
import { validateBody, IdeaSchemaValidation } from '../../helpers/inputValidation';
import {getAllIdeas, getIdea, createIdea, deleteIdea, updateIdea} from '../../controllers/ideaController'

const router = express.Router();

router.get("/", getAllIdeas);

router.get("/:id", getIdea);

router.post("/user/:idUser", validateBody(IdeaSchemaValidation), passport.authenticate('jwt', { session: false }), createIdea);

router.patch("/:id/user/:idUser", validateBody(IdeaSchemaValidation), passport.authenticate('jwt', { session: false }), updateIdea);

router.delete("/:id/user/:idUser", passport.authenticate('jwt', { session: false }), deleteIdea);

export default router;