import _ from 'lodash';
import ResponseObject from '../helpers/response';
import local from '../config/globalization/local.en.json';
import IdeaService from '../services/ideaService';

const baseResponse = (httpCode, apiRoute, method) => {
    return new ResponseObject(httpCode, null, apiRoute, method);
};

const getApiInfo = (req) => {
    return {
        apiRoute: _.get(req, 'originalUrl'),
        apiMethod: _.get(req, 'method'),
    };
};

const resGeneral = local.general;
const resIdea = local.idea;

export const getAllIdeas = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    const ideas = await IdeaService.findAllIdeas();

    return baseResponse(200, apiRoute, apiMethod)
        .constructResponse(ideas, true, res);
};

export const getIdea = async (req, res, next) => {
    const idIdea = _.get(req, 'params.id');
    const {apiRoute, apiMethod} = getApiInfo(req);
    const idea = await IdeaService.findOneIdeaById(idIdea);
    if (!idea) {
        return baseResponse(400, apiRoute, apiMethod)
            .constructResponse(resIdea.NOT_EXIST, false, res);
    }
    return baseResponse(200, apiRoute, apiMethod)
        .constructResponse(idea, true, res);
};

export const createIdea = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    if (req.user._id != req.params.idUser) {
        return baseResponse(403, apiRoute, apiMethod)
            .constructResponse(resGeneral.UNAUTHORIZED, false, res);
    }
    const titleReq = _.get(req, 'body.title', '');
    const summaryReq = _.get(req, 'body.summary', '');
    const detailsReq = _.get(req, 'body.details', '');
    const ideaDTO = {
        title: titleReq,
        summary: summaryReq,
        details: detailsReq,
        userID: req.user._id,
    };
    const ideaService = new IdeaService(ideaDTO);

    const savedIdea = await ideaService.createIdea();
    const {_id, title, summary, details} = savedIdea;

    return baseResponse(201, apiRoute, apiMethod)
        .constructResponse(
            {_id, title, summary, details, userID: req.user._id},
            true,
            res,
        );
};

export const updateIdea = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    const idIdea = _.get(req, 'params.id');
    const idUser = _.get(req, 'params.idUser');

    const currentIdea = await IdeaService.findOneIdeaById(idIdea);
    if (currentIdea === null) {
        return baseResponse(400, apiRoute, apiMethod)
            .constructResponse(resGeneral.BAD_REQUEST, false, res);
    }
    if (req.user._id != idUser ||
        currentIdea.userID._id.toString() != req.user._id.toString()) {
        return baseResponse(403, apiRoute, apiMethod)
            .constructResponse(resGeneral.UNAUTHORIZED, false, res);
    }

    const ideaDTO = _.get(req, 'body');
    const ideaService = new IdeaService(ideaDTO);
    const {_id, title, summary, details} = ideaService.idea;

    await ideaService.updateIdea(idIdea, idUser);

    return baseResponse(200, apiRoute, apiMethod)
        .constructResponse({_id, title, summary, details, userID: req.user._id},
            true,
            res,
        );
};

export const deleteIdea = async (req, res, next) => {
    const {apiRoute, apiMethod} = getApiInfo(req);
    const currentIdea = await IdeaService.findOneIdeaById(req.params.id);
    if (currentIdea === null) {
        return baseResponse(400, apiRoute, apiMethod)
            .constructResponse(resGeneral.BAD_REQUEST, false, res);
    }

    if (req.user._id != req.params.idUser ||
        currentIdea.userID._id.toString() != req.user._id.toString()) {
        return baseResponse(403, apiRoute, apiMethod)
            .constructResponse(resGeneral.UNAUTHORIZED, false, res);
    }

    await IdeaService.deleteIdea(req.params.id);
    return baseResponse(204, apiRoute, apiMethod)
        .constructResponse(resIdea.DELETED, true, res);
};
