import {User} from '../Models/User/userModel';
import NotFoundError from '../helpers/response/notFound.error';
import ExistingError from '../helpers/response/existing.error';
/**
 *Service related to database queries
 *Database : users
 * @class UserService
 */
export default class UserService {
    /**
     *Creates an instance of UserService.
     * @memberof UserService
     */
    constructor() {}

    /**
     *Return all users from database
     * @static
     * @function findAllUser
     * @return {Promise<User>} All users from the database.
     * @memberof UserService
     */
    async findAllUser() {
        return await User.find().select('-__v -password');
    }

    /**
     *Return a user based on its ID
     * @static
     * @function findOneUserById
     * @param {*} id
     * @return {Promise<User>} The user from the database.
     * @memberof UserService
     */
    async findOneUserById(id) {
        const user = await User
            .findById(id)
            .select('-__v -password');
        if (!user) {
            throw new NotFoundError(`User data NOT FOUND for userID : ${id}`);
        }
        return user;
    }

    /**
     *Return a user from an email or a username
     * @param {*} userDTO
     * @memberof UserService
     */
    async findIfOneUserExists(userDTO) {
        const user = await User.findOne({
            $or: [
                {email: userDTO.email},
                {username: userDTO.username},
            ],
        });
        if (user) {
            throw new ExistingError(
                `Username or Email already exists`,
            );
        }
    }

    /**
     *Create a user (signup function)
     * @param {*} userDTO
     * @return {Promise<User>} user stored in database
     * @memberof UserService
     */
    async createUser(userDTO) {
        const user = new User(userDTO);
        return await user.save();
    }

    /**
     *Update a user. Don't create a new user if not exists
     * @param {ObjectID} id
     * @param {*} userDTO
     * @memberof UserService
     */
    async updateUser(id, userDTO) {
        const user = new User(userDTO);
        user.password = await user
            .hashPassword(user.password);

        const {username, firstname, lastname, email, age, password} = user;
        await User.replaceOne(
            {_id: id},
            {username, firstname, lastname, email, age, password},
            {multi: false});

        return {_id: id, username, firstname, lastname, email, age};
    }
}

