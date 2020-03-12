import _ from 'lodash';
import * as HTTPStatus from 'http-status-codes';
import local from '../config/globalization/local.en.json';
import Controller from './baseController';
import {validateUserID,
    validateUserIdForIdea} from '../helpers/inputValidation';
require('express-async-errors');

const resIdea = local.idea;

/**
 * Idea controller for idea route
 *
 * @export
 * @class IdeaController
 * @extends {Controller}
 */
export default class IdeaController extends Controller {
    /**
     *Creates an instance of IdeaController.
     * @param {*} service
     * @param {*} userService
     * @memberof IdeaController
     */
    constructor(service, userService) {
        super(service);
        this.userService = userService;
    }

    /**
     *Get All ideas
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof IdeaController
     */
    async getAllIdeas(req, res, next) {
        this.apiInformation(req);
        const ideas = await this.service.findAllIdeas();

        return this.callResponseObject(HTTPStatus.OK, ideas,
            this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Get an idea based on its ID
     * If the idea is not found, return a not found exception
     * Code 404. Otherwise return user base information.
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof UserController
     */
    async getIdea(req, res, next) {
        const idIdea = _.get(req, 'params.id');
        this.apiInformation(req);
        const idea = await this.service.findOneIdeaById(idIdea);

        return this.callResponseObject(HTTPStatus.OK, idea,
            this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Get all the idea for a specific user.
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof IdeaController
     */
    async getAllIdeasFromUser(req, res, next) {
        const idUser = _.get(req, 'params.idUser');
        this.apiInformation(req);

        await this.userService.findOneUserById(idUser);

        const idea = await this.service.findByUser(idUser);
        const responseData = !idea ? resIdea.NOT_EXIST : idea;
        return this.callResponseObject(HTTPStatus.OK, responseData,
            this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Create a new idea for a specific user
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof IdeaController
     */
    async createIdea(req, res, next) {
        this.apiInformation(req);
        validateUserID(req.user._id, req.params.idUser);
        const titleReq = _.get(req, 'body.title', '');
        const summaryReq = _.get(req, 'body.summary', '');
        const detailsReq = _.get(req, 'body.details', '');
        const ideaDTO = {
            title: titleReq,
            summary: summaryReq,
            details: detailsReq,
            userID: req.user._id,
        };

        const savedIdea = await this.service.createIdea(ideaDTO);
        const {_id, title, summary, details} = savedIdea;

        return this.callResponseObject(HTTPStatus.CREATED,
            {_id, title, summary, details, userID: req.user._id},
            this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Update an idea for a user
     * If the idea is not found, or does not belong to the user
     * return an exception NotFound or Unauthorized
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof IdeaController
     */
    async updateIdea(req, res, next) {
        this.apiInformation(req);
        const idIdea = _.get(req, 'params.id');
        const idUser = _.get(req, 'params.idUser');

        const findIdea = await this.service.findOneIdeaById(idIdea);
        validateUserID(req.user._id, req.params.idUser);
        validateUserIdForIdea(findIdea.userID._id, req.user._id);
        console.log(req.user._id);
        console.log(req.params.id);
        const ideaDTO = _.get(req, 'body');

        const ideaUpdate = await this.service
            .updateIdea(ideaDTO, idIdea, idUser);

        return this.callResponseObject(HTTPStatus.OK,
            ideaUpdate,
            this.apiRoute, this.apiMethod, true, res);
    }

    /**
     * Delete an idea that belongs to a user
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return {Response}
     * @memberof IdeaController
     */
    async deleteIdea(req, res, next) {
        this.apiInformation(req);
        const findIdea = await this.service.findOneIdeaById(req.params.id);

        validateUserID(req.user._id, req.params.idUser);
        validateUserIdForIdea(findIdea.userID._id, req.user._id);

        await this.service.deleteIdea(req.params.id);

        return this.callResponseObject(HTTPStatus.NO_CONTENT,
            resIdea.DELETED,
            this.apiRoute, this.apiMethod, true, res);
    }
}
