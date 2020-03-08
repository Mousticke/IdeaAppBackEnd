import app from '../../src/';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {mongoObjectId, baseExpect} from '../utils/utils';
import {
    mockCreateFirstUser, mockCreateSecondUser, mockUserLogin,
    deleteAllUsers,
} from '../user/mockUser';
import {
    deleteAllUserSettings,
    mockCreateSettings, updateUserSettings} from './mockUserSettings';

chai.use(chaiHttp);
const {expect} = chai;
const firstRandom = Math.floor(Math.random() * 100);
const secondRandom = Math.floor(Math.random() * 100);

let firstUser;
let secondUser;
let firstUserSettings;
let secondUserSettings;
let validLoginToken = '';

const loginUser = () => {
    return new Promise((resolve) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send(mockUserLogin(firstUser))
            .end((err, res) => {
                const resData = res.body.response.data;
                validLoginToken = resData.token;
                resolve();
            });
    });
};

describe('User Settings Endpoints ', function() {
    before(async function() {
        deleteAllUserSettings();
        deleteAllUsers();
        firstUser = mockCreateFirstUser(firstRandom);
        secondUser = mockCreateSecondUser(secondRandom);

        await firstUser.save();
        await secondUser.save();

        firstUserSettings = mockCreateSettings(firstUser._id);
        secondUserSettings = mockCreateSettings(secondUser._id);

        await firstUserSettings.save();
        await secondUserSettings.save();

        await loginUser();
    });

    after(function(done) {
        deleteAllUserSettings();
        deleteAllUsers();
        done();
    });

    describe('/GET userSettings', function() {
        it('Should get the first user settings', function(done) {
            chai.request(app)
                .get(`/api/v1/users/${firstUser._id}/settings`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = `/api/v1/users/${firstUser._id}/settings`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'GET');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('object');
                    expect(resData.themeName).to.equal('Light');
                    expect(resData.newsletter).to.equal(false);
                    expect(resData.avatar).to.equal('');
                    expect(resData.userID.password).to.be.undefined;
                    done();
                });
        });

        it('Should unauthorized to get user settings', function(done) {
            const fakeID = mongoObjectId();
            chai.request(app)
                .get(`/api/v1/users/${fakeID}/settings`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const resError = res.body.response.error;
                    const code = 403;
                    const apiRoute = `/api/v1/users/${fakeID}/settings`;

                    expect(res.status).to.equal(403);
                    baseExpect(res.body, code, apiRoute, false, 'GET');
                    expect(res.body.response).to.have.property('error');
                    expect(resData).to.be.undefined;
                    expect(resError)
                        .to
                        .equal('Unauthorized request for these parameters');
                    done();
                });
        });

        it('Should unauthorized from bad token', function(done) {
            chai.request(app)
                .get(`/api/v1/users/${firstUser._id}/settings`)
                .set('Authorization', 'Bearer ' + '12356')
                .end((err, res) => {
                    const resError = res.error;
                    expect(resError.status).to.equal(401);
                    expect(res).to.have.property('error');
                    expect(resError.text)
                        .to
                        .equal('Unauthorized');
                    done();
                });
        });
    });

    describe('/PATCH userSettings', function() {
        it('Should update user settings', function(done) {
            const route =
            `/api/v1/users/${firstUser._id}/settings/${firstUserSettings._id}`;
            chai.request(app)
                .patch(route)
                .send(updateUserSettings('Dark', true, ''))
                .set('Authorization', 'Bearer ' + validLoginToken)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = route;
                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'PATCH');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('object');
                    expect(resData.themeName).to.equal('Dark');
                    expect(resData.newsletter).to.equal(true);
                    expect(resData.avatar).to.equal('');
                    expect(resData.userID.password).to.be.undefined;
                    done();
                });
        });

        it('Should unauthorized to update user settings', function(done) {
            const fakeID = mongoObjectId();
            const route =
            `/api/v1/users/${fakeID}/settings/${firstUserSettings._id}`;
            chai.request(app)
                .patch(route)
                .send(updateUserSettings('Dark', true, ''))
                .set('Authorization', 'Bearer ' + validLoginToken)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const resError = res.body.response.error;
                    const code = 403;
                    const apiRoute = route;

                    expect(res.status).to.equal(403);
                    baseExpect(res.body, code, apiRoute, false, 'PATCH');
                    expect(res.body.response).to.have.property('error');
                    expect(resData).to.be.undefined;
                    expect(resError)
                        .to
                        .equal('Unauthorized request for these parameters');
                    done();
                });
        });

        it('Should unauthorized update from bad token', function(done) {
            const route =
            `/api/v1/users/${firstUser._id}/settings/${firstUserSettings._id}`;
            chai.request(app)
                .patch(route)
                .send(updateUserSettings('Dark', true, ''))
                .set('Authorization', 'Bearer ' + '12356')
                .end((err, res) => {
                    const resError = res.error;
                    expect(resError.status).to.equal(401);
                    expect(res).to.have.property('error');
                    expect(resError.text)
                        .to
                        .equal('Unauthorized');
                    done();
                });
        });

        it('Should not update setting that does not exist', function(done) {
            const fakeID = mongoObjectId();
            const route =
            `/api/v1/users/${firstUser._id}/settings/${fakeID}`;
            chai.request(app)
                .patch(route)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .end((err, res) => {
                    const code = 400;
                    expect(res.status).to.equal(code);
                    done();
                });
        });
    });
});
