import {UserSetting} from '../Models/User/userSettingModel';

/**
 *Service related to database queries
 *Database : usersSettings
 * @class UserSettingsService
 */
export class UserSettingsService {
    /**
     *Creates an instance of UserSettingsService.
     * @param {*} settings
     * @memberof UserSettingsService
     */
    constructor(settings) {
        this.settings = new UserSetting(settings);
    }

    /**
     *Return user's settings
     * @static
     * @param {ObjectID} idUser
     * @return {Promise<UserSettings>} The user settings from the database.
     * @memberof UserSettingsService
     */
    static async findUserSettings(idUser) {
        return await UserSetting.findOne(
            {userID: idUser}).populate('userID', '-password');
    }

    /**
     *Return a user setting based on its id
     * @static
     * @param {ObjectID} idSetting
     * @return {Promise<UserSettings>} The user settings from the database.
     * @memberof UserSettingsService
     */
    static async findByIdSetting(idSetting) {
        return await UserSetting.findById(idSetting)
            .select('-__v -userID');
    }

    /**
     *
     *
     * @param {*} idSettings id settings for a specific user
     * @param {*} idUser id user for the current settings
     * @memberof UserSettingsService
     */
    async updateUserSettings(idSettings, idUser) {
        const themeName = this.settings.themeName;
        const newsletter = this.settings.newsletter;
        const avatar = this.settings.avatar;
        await UserSetting.replaceOne(
            {_id: idSettings},
            {themeName, newsletter, avatar, userID: idUser},
            {multi: false});
    }
}

