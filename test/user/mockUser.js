import {User} from '../../src/Models/User/userModel';

export const mockUserLogin = (user) => {
    return {
        username: user.username,
        password: '123456',
    };
};

export const mockUserLoginFailure = () => {
    return {
        username: 'Do not Exist',
        password: '123456',
    };
};

export const mockCreateFirstUser = (randomNumber) => {
    return new User({
        'username': 'Mousticke'+randomNumber,
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'akim'+randomNumber+'.benchiha@test.com',
        'age': '11.18.1995',
        'password': '123456',
    });
};

export const mockCreateSecondUser = (randomNumber) => {
    return new User({
        'username': 'Mousticke_'+randomNumber,
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'akim'+randomNumber+'.benchiha@test.com',
        'age': '11.18.1995',
        'password': '123456',
    });
};

export const mockCreateThirdUser = (randomNumber) => {
    return new User({
        'username': 'Mousticke_'+randomNumber,
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'akim'+randomNumber+'.benchiha@test.com',
        'age': '11.18.1995',
        'password': '123456',
    });
};

export const mockCreateUserFromRoute = () => {
    return {
        'username': 'Mousticke_3',
        'firstname': 'Akim',
        'password': '123456',
        'lastname': 'Benchiha',
        'email': 'akim3.benchiha@test.com',
        'age': '11.18.1995',
    };
};

export const mockCreateUserFailureBody = () => {
    return {
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'akim3.benchiha@test.com',
        'age': '11.18.1995',
        'password': '123456',
    };
};

export const mockCreateUserFailureUserExist = () => {
    return {
        'username': 'Mousticke_3',
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'akim3.benchiha@test.com',
        'age': '11.18.1995',
        'password': '123456',
    };
};

export const mockUpdateSuccess = () => {
    return {
        'username': 'MoustickeRename',
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'rename.benchiha@test.com',
        'age': '11.18.1995',
        'password': '1234567',
        'repeatPassword': '1234567',
    };
};

export const mockUpdateFailurePassword = () => {
    return {
        'username': 'MoustickeRename',
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'rename.benchiha@test.com',
        'age': '11.18.1995',
        'password': '1234567',
        'repeatPassword': '123456789',
    };
};

export const mockUpdateFailureBody = () => {
    return {
        'username': 'M',
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'rename.benchiha@test.com',
        'age': '11.18.1995',
        'password': '1234567',
        'repeatPassword': '123456789',
    };
};

export const mockUpdateFailureUserExist = () => {
    return {
        'username': 'Mousticke_2',
        'firstname': 'Akim',
        'lastname': 'Benchiha',
        'email': 'rename.benchiha@test.com',
        'age': '11.18.1995',
        'password': '1234567',
        'repeatPassword': '123456789',
    };
};

export const deleteAllUsers = () => {
    return new Promise((resolve, reject) => {
        resolve(User.deleteMany());
    });
};
