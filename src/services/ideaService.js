import {Idea} from '../Models/Idea/ideaModel';
import NotFoundError from '../helpers/response/notFound.error';

/**
 *Service related to database queries
 *Database : ideas
 * @export
 * @class IdeaService
 */
export default class IdeaService {
    /**
     *Creates an instance of IdeaService.
     * @memberof IdeaService
     */
    constructor() {}

    /**
     *Return all ideas from database
     * @function findAllIdeas
     * @return {Promise<Idea>} All ideas from the database.
     * @memberof IdeaService
     */
    async findAllIdeas() {
        return await Idea.find().populate('userID', '-password');
    }

    /**
     *Return a idea based on its ID
     * @function findOneIdeaById
     * @param {ObjectID} id
     * @return {Promise<Idea>} The idea from the database.
     * @memberof IdeaService
     */
    async findOneIdeaById(id) {
        const idea = await Idea
            .findById(id)
            .populate('userID', '-password');
        if (!idea) {
            throw new NotFoundError(`Idea data NOT FOUND for ideaID : ${id}`);
        }
        return idea;
    }

    /**
     *Return a idea based on a user
     * @function findByUser
     * @param {ObjectID} idUser
     * @return {Promise<Idea>} The idea from the database.
     * @memberof IdeaService
     */
    async findByUser(idUser) {
        return await Idea
            .find({userID: idUser})
            .populate('userID', '-password');
    }

    /**
     *Create an idea
     * @param {*} ideaDTO
     * @return {Promise<Idea>} idea stored in database
     * @memberof IdeaService
     */
    async createIdea(ideaDTO) {
        const idea = new Idea(ideaDTO);
        return await idea.save();
    }

    /**
     *Update an idea. Don't create a new idea if not exists
     * @param {*} ideaDTO
     * @param {ObjectID} idIdea
     * @param {ObjectID} idUser
     * @memberof IdeaService
     */
    async updateIdea(ideaDTO, idIdea, idUser) {
        const {title, summary, details} = ideaDTO;
        await Idea.replaceOne(
            {_id: idIdea},
            {title, summary, details, userID: idUser},
            {multi: false});
        return {title, summary, details, userID: idUser};
    }

    /**
     *Delete an idea based on its id
     * @param {ObjectID} idIdea
     * @memberof IdeaService
     */
    async deleteIdea(idIdea) {
        await Idea.deleteOne({_id: idIdea});
    }
}

