import {UserSetting} from '../Models/User/userSettingModel';
import NotFoundError from '../helpers/response/notFound.error';

/**
 *Service related to database queries
 *Database : usersSettings
 * @class UserSettingsService
 */
export default class UserSettingsService {
    /**
     *Creates an instance of UserSettingsService.
     * @memberof UserSettingsService
     */
    constructor() {}

    /**
     *Return user's settings
     * @param {ObjectID} idUser
     * @return {Promise<UserSettings>} The user settings from the database.
     * @memberof UserSettingsService
     */
    async findUserSettings(idUser) {
        return await UserSetting.findOne(
            {userID: idUser}).populate('userID', '-password');
    }

    /**
     * Return a user setting based on its id
     * @param {ObjectID} idSetting
     * @return {Promise<UserSettings>} The user settings from the database.
     * @memberof UserSettingsService
     */
    async findByIdSetting(idSetting) {
        const settings = await UserSetting.findById(idSetting)
            .select('-__v');

        if (!settings) {
            throw new NotFoundError(
                `User settings data NOT FOUND for settingsID : 
                ${idSetting}`);
        }
        return settings;
    }

    /**
     *Create user settings for the newly created User
     *
     * @param {*} userID
     * @memberof UserSettingsService
     * @return {Promise<UserSettings>} The user settings from the database.
     */
    async createUserSettings(userID) {
        const settings = new UserSetting({userID: userID});
        return settings.save();
    }

    /**
     * Update user settings
     * @param {*} settingsDTO settings body
     * @param {*} idSettings id settings for a specific user
     * @param {*} idUser id user for the current settings
     * @memberof UserSettingsService
     */
    async updateUserSettings(settingsDTO, idSettings, idUser) {
        const settings = new UserSetting(settingsDTO);
        const themeName = settings.themeName;
        const newsletter = settings.newsletter;
        const avatar = settings.avatar;
        await UserSetting.replaceOne(
            {_id: idSettings},
            {themeName, newsletter, avatar, userID: idUser},
            {multi: false});
        return {themeName, newsletter, avatar, userID: idUser};
    }
}

