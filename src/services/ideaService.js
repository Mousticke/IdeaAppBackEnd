import {Idea} from '../Models/Idea/ideaModel';

/**
 *Service related to database queries
 *Database : ideas
 * @export
 * @class IdeaService
 */
export default class IdeaService {
    /**
     *Creates an instance of IdeaService.
     * @param {*} idea
     * @memberof IdeaService
     */
    constructor(idea) {
        this.idea = new Idea(idea);
    }

    /**
     *Return all ideas from database
     * @static
     * @function findAllIdeas
     * @return {Promise<Idea>} All ideas from the database.
     * @memberof IdeaService
     */
    static async findAllIdeas() {
        return await Idea.find().populate('userID', '-password');
    }

    /**
     *Return a idea based on its ID
     * @static
     * @function findOneIdeaById
     * @param {ObjectID} id
     * @return {Promise<Idea>} The idea from the database.
     * @memberof IdeaService
     */
    static async findOneIdeaById(id) {
        return await Idea
            .findById(id)
            .populate('userID', '-password');
    }

    /**
     *Return a idea based on a user
     * @static
     * @function findByUser
     * @param {ObjectID} idUser
     * @return {Promise<Idea>} The idea from the database.
     * @memberof IdeaService
     */
    static async findByUser(idUser) {
        return await Idea
            .find({userID: idUser})
            .populate('userID', '-password');
    }

    /**
     *Create an idea
     * @return {Promise<Idea>} idea stored in database
     * @memberof IdeaService
     */
    async createIdea() {
        return await this.idea.save();
    }

    /**
     *Update an idea. Don't create a new idea if not exists
     * @param {ObjectID} idIdea
     * @param {ObjectID} idUser
     * @memberof IdeaService
     */
    async updateIdea(idIdea, idUser) {
        const {title, summary, details} = this.idea;
        await Idea.replaceOne(
            {_id: idIdea},
            {title, summary, details, userID: idUser},
            {multi: false});
    }

    /**
     *Delete an idea based on its id
     * @static
     * @param {ObjectID} idIdea
     * @memberof IdeaService
     */
    static async deleteIdea(idIdea) {
        await Idea.deleteOne({_id: idIdea});
    }
}

