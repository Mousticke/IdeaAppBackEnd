import app from '../../src/';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {mockUserLogin,
    mockUserLoginFailure,
    mockCreateFirstUser, mockCreateSecondUser,
    mockCreateUserFromRoute, mockCreateUserFailureUserExist,
    mockCreateUserFailureBody,
    mockUpdateSuccess, mockUpdateFailurePassword,
    mockUpdateFailureBody, mockUpdateFailureUserExist,
    deleteAllUsers} from './mockUser';

chai.use(chaiHttp);
const {expect} = chai;

const mongoObjectId = function() {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

const baseExpect = function(body, code, apiUrl, success, method) {
    expect(body).to.not.be.undefined;
    expect(body).to.have.property('code');
    expect(body).to.have.property('method');
    expect(body).to.have.property('apiURL');
    expect(body).to.have.property('success');
    expect(body).to.have.property('response');

    expect(body.code).to.equal(code);
    expect(body.method).to.equal(method);
    expect(body.apiURL).to.equal(apiUrl);
    expect(body.success).to.equal(success);
    expect(body.response).to.be.an('object');
};

describe('User Endpoints ', function() {
    let firstUser;
    let secondUser;
    let validLoginToken = '';

    before(function(done) {
        deleteAllUsers(done);

        firstUser = mockCreateFirstUser();
        secondUser = mockCreateSecondUser();

        firstUser.save();
        secondUser.save();
    });


    describe('/GET users', function() {
        it('Should GET all the users', function(done) {
            chai.request(app)
                .get('/api/v1/users')
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = `/api/v1/users`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'GET');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('array');
                    expect(resData).to.have.lengthOf(2);
                    done();
                });
        });
    });

    describe('/GET users with an id', function() {
        it('Should GET a user', function(done) {
            chai.request(app)
                .get(`/api/v1/users/${firstUser._id}`)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = `/api/v1/users/${firstUser._id}`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'GET');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('object');
                    expect(resData.username).to.equal('Mousticke');
                    expect(resData.firstname).to.equal('Akim');
                    expect(resData.lastname).to.equal('Benchiha');
                    expect(resData.email).to.equal('akim.benchiha@test.com');
                    expect(resData.password).to.not.equal('123456');
                    done();
                });
        });

        it('Should return a Bad request : id is not valid', function(done) {
            const currentID = mongoObjectId();
            chai.request(app)
                .get(`/api/v1/users/${currentID}`)
                .end((err, res) => {
                    const code = 400;
                    const resError = res.body.response.error;
                    const apiRoute = `/api/v1/users/${currentID}`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'GET');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });
    });

    describe('/POST log in a user', function() {
        it('Should login a user', function(done) {
            chai.request(app)
                .post('/api/v1/users/login')
                .send(mockUserLogin(firstUser))
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = `/api/v1/users/login`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'POST');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('object');
                    expect(resData.username).to.equal('Mousticke');
                    expect(resData.firstname).to.equal('Akim');
                    expect(resData.lastname).to.equal('Benchiha');
                    expect(resData.email).to.equal('akim.benchiha@test.com');
                    expect(resData.password).to.not.equal('123456');
                    expect(resData.token).to.not.be.null;
                    validLoginToken = resData.token;
                    done();
                });
        });

        it('Should not login a user. Invalid credentials', function(done) {
            chai.request(app)
                .post('/api/v1/users/login')
                .send(mockUserLoginFailure())
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 401;
                    const apiRoute = `/api/v1/users/login`;

                    expect(res.status).to.equal(401);
                    baseExpect(res.body, code, apiRoute, false, 'POST');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    expect(resError).to.be.an('object');
                    done();
                });
        });
    });

    describe('/POST create a user', function() {
        it('Should create a user', function(done) {
            const user = mockCreateUserFromRoute();
            chai.request(app)
                .post(`/api/v1/users/register`)
                .send(user)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 201;
                    const apiRoute = `/api/v1/users/register`;

                    expect(res.status).to.equal(201);
                    baseExpect(res.body, code, apiRoute, true, 'POST');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('object');
                    expect(resData.username).to.equal('Mousticke_3');
                    expect(resData.firstname).to.equal('Akim');
                    expect(resData.lastname).to.equal('Benchiha');
                    expect(resData.email).to.equal('akim3.benchiha@test.com');
                    expect(resData.password).to.not.equal('123456');
                    done();
                });
        });

        it('Should not create a user (Body invalid)', function(done) {
            chai.request(app)
                .post(`/api/v1/users/register`)
                .send(mockCreateUserFailureBody())
                .end((err, res) => {
                    const code = 400;
                    const resError = res.body.response.error;
                    const apiRoute = `/api/v1/users/register`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'POST');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });

        it('Should not create a user (User exist)', function(done) {
            chai.request(app)
                .post(`/api/v1/users/register`)
                .send(mockCreateUserFailureUserExist())
                .end((err, res) => {
                    const code = 400;
                    const resError = res.body.response.error;
                    const apiRoute = `/api/v1/users/register`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'POST');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });
    });

    describe('/PATCH update a user', function() {
        it('Should update a user with success', function(done) {
            chai.request(app)
                .patch(`/api/v1/users/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(mockUpdateSuccess())
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = `/api/v1/users/${firstUser._id}`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'PATCH');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('object');
                    expect(resData.username).to.equal('MoustickeRename');
                    expect(resData.firstname).to.equal('Akim');
                    expect(resData.lastname).to.equal('Benchiha');
                    expect(resData.email).to.equal('rename.benchiha@test.com');
                    expect(resData.password).to.not.equal('1234567');
                    done();
                });
        });

        it('Should not update user. (Password unmatched)', function(done) {
            chai.request(app)
                .patch(`/api/v1/users/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(mockUpdateFailurePassword())
                .end((err, res) => {
                    const code = 400;
                    const resError = res.body.response.error;
                    const apiRoute = `/api/v1/users/${firstUser._id}`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'PATCH');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });

        it('Should not update user. (Body not valid)', function(done) {
            chai.request(app)
                .patch(`/api/v1/users/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(mockUpdateFailureBody())
                .end((err, res) => {
                    const code = 400;
                    const resError = res.body.response.error;
                    const apiRoute = `/api/v1/users/${firstUser._id}`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'PATCH');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });

        it('Should not update user. (User already exist)', function(done) {
            chai.request(app)
                .patch(`/api/v1/users/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(mockUpdateFailureUserExist())
                .end((err, res) => {
                    const code = 400;
                    const resError = res.body.response.error;
                    const apiRoute = `/api/v1/users/${firstUser._id}`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'PATCH');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });

        it('Should not update user. (Request id invalid from the given token)',
            function(done) {
                chai.request(app)
                    .patch(`/api/v1/users/${secondUser._id}`)
                    .set('Authorization', 'Bearer ' + validLoginToken)
                    .send(mockUpdateSuccess())
                    .end((err, res) => {
                        const code = 403;
                        const resError = res.body.response.error;
                        const apiRoute = `/api/v1/users/${secondUser._id}`;

                        expect(res.status).to.equal(403);
                        baseExpect(res.body, code, apiRoute, false, 'PATCH');
                        expect(res.body.response).to.have.property('error');
                        expect(resError).to.not.be.undefined;
                        done();
                    });
            });
    });
});
