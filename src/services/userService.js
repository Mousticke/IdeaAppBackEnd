import {User} from '../Models/User/userModel';
/**
 *Service related to database queries
 *Database : users
 * @class UserService
 */
export class UserService {
    /**
     *Creates an instance of UserService.
     * @param {*} user
     * @memberof UserService
     */
    constructor(user) {
        this.user = new User(user);
    }

    /**
     *Return all users from database
     * @static
     * @function findAllUser
     * @return {Promise<User>} All users from the database.
     * @memberof UserService
     */
    static async findAllUser() {
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
    static async findOneUserById(id) {
        return await User
            .findById(id)
            .select('-__v -password');
    }

    /**
     *Return a user from an email or a username
     * @return {Promise<User>} The user from the database.
     * @memberof UserService
     */
    async findOneUser() {
        return await User.findOne({
            $or: [
                {email: this.user.email},
                {username: this.user.username},
            ],
        });
    }

    /**
     *Create a user (signup function)
     * @param {*} user
     * @return {Promise<User>} user stored in database
     * @memberof UserService
     */
    async createUser(user) {
        return await this.user.save();
    }

    /**
     *Update a user. Don't create a new user if not exists
     * @static
     * @param {*} id
     * @memberof UserService
     */
    async updateUser(id) {
        const {username, firstname, lastname, email, age, password} = this.user;
        await User.replaceOne(
            {_id: id},
            {username, firstname, lastname, email, age, password},
            {multi: false});
    }
}

