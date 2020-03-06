import {UserSetting} from '../../src/Models/User/userSettingModel';

export const deleteAllUserSettings = () => {
    return new Promise((resolve, reject) => {
        resolve(UserSetting.deleteMany());
    });
};

export const mockCreateSettings = (id) => {
    return new UserSetting({
        'themeName': 'Light',
        'newsletter': false,
        'avatar': '',
        'userID': id,
    });
};

export const updateUserSettings = (themeName, newsletter, avatar) => {
    return {
        'themeName': themeName,
        'newsletter': newsletter,
        'avatar': avatar,
    };
};
