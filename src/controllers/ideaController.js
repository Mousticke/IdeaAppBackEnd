import _ from "lodash";
import ResponseObject from "../helpers/response";
import { Idea } from "../Models/Idea/ideaModel";

const constructResponse = (httpCode, data, originURL, method) => {
    return new ResponseObject(
        httpCode,
        data,
        originURL,
        method
    );
}

export const getAllIdeas = async (req, res, next) => {
    try {
        const ideas = await Idea.find().populate('userID', '-password');

        const responseObject = constructResponse(200, ideas, _.get(req, "originalUrl", ""), req.method)
        return responseObject.returnResponseData(true)(res)
    } catch (error) {
        const responseObject = constructResponse(500, error, _.get(req, "originalUrl", ""), req.method);
        return responseObject.returnResponseData(false)(res)
    }
}

export const getIdea = async (req, res, next) => {
    try {
        const idea = await Idea.findById(_.get(req, "params.id")).populate('userID', '-password');
        if (!idea) {
            const responseObject = constructResponse(400, "Idea does not exist", _.get(req, "originalUrl", ""), req.method)
            return responseObject.returnResponseData(false)(res)
        }
        const responseObject = constructResponse(200, idea, _.get(req, "originalUrl", ""), req.method)
        return responseObject.returnResponseData(true)(res)
    } catch (error) {
        const responseObject = constructResponse(500, error, _.get(req, "originalUrl", ""), req.method);
        return responseObject.returnResponseData(false)(res)
    }
}

export const createIdea = async (req, res, next) => {
    try {
        if (req.user._id != req.params.idUser) {
            const responseObject = constructResponse(403, "Unauthorized request for these parameters", _.get(req, "originalUrl", ""), req.method)
            return responseObject.returnResponseData(false)(res)
        }
        const titleReq = _.get(req, "body.title", "");
        const summaryReq = _.get(req, "body.summary", "");
        const detailsReq = _.get(req, "body.details", "");
        const idea = new Idea({ title:titleReq, summary: summaryReq, details: detailsReq, userID: req.user._id});

        const savedIdea = await idea.save();
        const { _id, title, summary, details } = savedIdea

        const responseObject = constructResponse(201, { _id, title, summary, details, userID: req.user._id }, _.get(req, "originalUrl", ""), req.method)
        return responseObject.returnResponseData(true)(res)
    } catch (error) {
        const responseObject = constructResponse(500, error, _.get(req, "originalUrl", ""), req.method);
        return responseObject.returnResponseData(false)(res)
    }
}

export const updateIdea = async (req, res, next) => {
    try {
        if (req.user._id != req.params.idUser) {
            const responseObject = constructResponse(403, "Unauthorized request for these parameters", _.get(req, "originalUrl", ""), req.method)
            return responseObject.returnResponseData(false)(res)
        }

        const idea = new Idea(_.get(req, "body"));
        const { _id, title, summary, details } = idea

        await Idea.replaceOne({ _id: req.params.id }, { title, summary, details, userID: req.params.idUser }, { multi: false });

        const responseObject = constructResponse(200, { _id, title, summary, details, userID: req.user._id }, _.get(req, "originalUrl", ""), req.method)
        return responseObject.returnResponseData(true)(res)
    } catch (error) {
        const responseObject = constructResponse(500, error, _.get(req, "originalUrl", ""), req.method);
        return responseObject.returnResponseData(false)(res)
    }
}

export const deleteIdea = async (req, res, next) => {
    try {
        if (req.user._id != req.params.idUser) {
            const responseObject = constructResponse(403, "Unauthorized request for these parameters", _.get(req, "originalUrl", ""), req.method)
            return responseObject.returnResponseData(false)(res)
        }

        await Idea.deleteOne({_id: req.params.id})
        const responseObject = constructResponse(204, "Idea deleted successfully", _.get(req, "originalUrl", ""), req.method)
        return responseObject.returnResponseData(true)(res)
    } catch (error) {
        const responseObject = constructResponse(500, error, _.get(req, "originalUrl", ""), req.method);
        return responseObject.returnResponseData(false)(res)
    }
}