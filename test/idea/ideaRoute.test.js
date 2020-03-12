import app from '../../src';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {mongoObjectId, baseExpect} from '../utils/utils';
import {
    mockCreateFirstUser, mockCreateSecondUser, mockUserLogin,
    deleteAllUsers,
} from '../user/mockUser';
import {
    deleteAllIdeas,
    mockCreateIdea, mockCreateIdeaFromRoute,
    mockIdeaFailureValidation, mockIdeaFailureBody,
    mockUpdateIdeaSuccess,
} from './mockIdea';

chai.use(chaiHttp);
const {expect} = chai;
const firstRandom = Math.floor(Math.random() * 100);
const secondRandom = Math.floor(Math.random() * 100);

let firstUser;
let secondUser;
let firstIdea;
let secondIdea;
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

describe('Idea Endpoints ', function() {
    before(async function() {
        deleteAllIdeas();
        deleteAllUsers();
        firstUser = mockCreateFirstUser(firstRandom);
        secondUser = mockCreateSecondUser(secondRandom);

        await firstUser.save();
        await secondUser.save();

        firstIdea = mockCreateIdea(firstUser._id);
        secondIdea = mockCreateIdea(secondUser._id);

        await firstIdea.save();
        await secondIdea.save();

        await loginUser();
    });

    after(function(done) {
        deleteAllIdeas();
        deleteAllUsers();
        done();
    });
    describe('/GET ideas', function() {
        it('Should get all ideas', function(done) {
            chai.request(app)
                .get(`/api/v1/ideas`)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = `/api/v1/ideas`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'GET');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('array');
                    done();
                });
        });
    });

    describe('/GET an idea with an id', function() {
        it('Should GET an idea', function(done) {
            chai.request(app)
                .get(`/api/v1/ideas/${firstIdea._id}`)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = `/api/v1/ideas/${firstIdea._id}`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'GET');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('object');
                    expect(resData.title).to.equal('New Idea from me');
                    expect(resData.userID._id).to
                        .equal(firstUser._id.toString());
                    expect(resData.summary).to
                        .equal(
                            'Explain what is my first idea',
                        );
                    expect(resData.details).to
                        .equal(
                            'This has to be updated soon...',
                        );
                    done();
                });
        });

        it('Should return a Bad request : id is not valid', function(done) {
            const currentID = mongoObjectId();
            chai.request(app)
                .get(`/api/v1/ideas/${currentID}`)
                .end((err, res) => {
                    const code = 404;
                    const resError = res.body.response.error;
                    const apiRoute = `/api/v1/ideas/${currentID}`;

                    expect(res.status).to.equal(404);
                    baseExpect(res.body, code, apiRoute, false, 'GET');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });
    });

    describe('/GET ideas based on a user', function() {
        it('Should GET all ideas from first User', function(done) {
            chai.request(app)
                .get(`/api/v1/ideas/users/${firstUser._id}`)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute = `/api/v1/ideas/users/${firstUser._id}`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'GET');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('array');
                    done();
                });
        });

        it('Should return an error. User does not exist', function(done) {
            const fakeID = mongoObjectId();
            chai.request(app)
                .get(`/api/v1/ideas/users/${fakeID}`)
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 404;
                    const apiRoute = `/api/v1/ideas/users/${fakeID}`;

                    expect(res.status).to.equal(404);
                    baseExpect(res.body, code, apiRoute, false, 'GET');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });
    });

    describe('/POST create an idea', function() {
        it('Should create an new idea', function(done) {
            const idea = mockCreateIdeaFromRoute();
            chai.request(app)
                .post(`/api/v1/ideas/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 201;
                    const apiRoute = `/api/v1/ideas/user/${firstUser._id}`;

                    expect(res.status).to.equal(201);
                    baseExpect(res.body, code, apiRoute, true, 'POST');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData).to.be.an('object');
                    expect(resData.title).to.equal('New title');
                    expect(resData.summary).to.equal('New summary');
                    expect(resData.details).to.equal('New details');
                    done();
                });
        });

        it('Should not create an new idea (id user invalid)', function(done) {
            const idea = mockCreateIdeaFromRoute();
            chai.request(app)
                .post(`/api/v1/ideas/user/${secondUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 401;
                    const apiRoute = `/api/v1/ideas/user/${secondUser._id}`;

                    expect(res.status).to.equal(401);
                    baseExpect(res.body, code, apiRoute, false, 'POST');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    expect(resError).to.be.an('object');
                    done();
                });
        });

        it('Should not create an new idea (body Invalid)', function(done) {
            const idea = mockIdeaFailureBody();
            chai.request(app)
                .post(`/api/v1/ideas/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 400;
                    const apiRoute = `/api/v1/ideas/user/${firstUser._id}`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'POST');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });

        it('Should not create an idea (validation Invalid)', function(done) {
            const idea = mockIdeaFailureValidation();
            chai.request(app)
                .post(`/api/v1/ideas/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 400;
                    const apiRoute = `/api/v1/ideas/user/${firstUser._id}`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'POST');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });
    });

    describe('/PATCH update an idea', function() {
        it('Should update an idea', function(done) {
            const idea = mockUpdateIdeaSuccess();
            chai.request(app)
                .patch(`/api/v1/ideas/${firstIdea._id}/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const code = 200;
                    const apiRoute =
                    `/api/v1/ideas/${firstIdea._id}/user/${firstUser._id}`;

                    expect(res.status).to.equal(200);
                    baseExpect(res.body, code, apiRoute, true, 'PATCH');
                    expect(res.body.response).to.have.property('data');
                    expect(resData).to.not.be.undefined;
                    expect(resData.title).to.equal('New title update');
                    expect(resData.summary).to.equal('New summary');
                    expect(resData.details).to.equal('Something different');
                    done();
                });
        });

        it('Should not update (idea does not belong to user)', function(done) {
            const idea = mockUpdateIdeaSuccess();
            chai.request(app)
                .patch(`/api/v1/ideas/${secondIdea._id}/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 401;
                    const apiRoute =
                    `/api/v1/ideas/${secondIdea._id}/user/${firstUser._id}`;

                    expect(res.status).to.equal(401);
                    baseExpect(res.body, code, apiRoute, false, 'PATCH');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });

        it('Should not update an idea (user forbidden)', function(done) {
            const idea = mockUpdateIdeaSuccess();
            chai.request(app)
                .patch(`/api/v1/ideas/${firstIdea._id}/user/${secondUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 401;
                    const apiRoute =
                    `/api/v1/ideas/${firstIdea._id}/user/${secondUser._id}`;

                    expect(res.status).to.equal(401);
                    baseExpect(res.body, code, apiRoute, false, 'PATCH');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });

        it('Should not update an idea (body invalid)', function(done) {
            const idea = mockIdeaFailureBody();
            chai.request(app)
                .patch(`/api/v1/ideas/${firstIdea._id}/user/${firstIdea._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 400;
                    const apiRoute =
                    `/api/v1/ideas/${firstIdea._id}/user/${firstIdea._id}`;

                    expect(res.status).to.equal(400);
                    baseExpect(res.body, code, apiRoute, false, 'PATCH');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });

        it('Should not update idea that does not exist', function(done) {
            const fakeID = mongoObjectId();
            const idea = mockUpdateIdeaSuccess();
            chai.request(app)
                .patch(`/api/v1/ideas/${fakeID}/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .send(idea)
                .end((err, res) => {
                    const code = 404;
                    expect(res.status).to.equal(code);
                    done();
                });
        });
    });
    describe('/DELETE an idea', function() {
        it('Should delete an idea', function(done) {
            chai.request(app)
                .delete(`/api/v1/ideas/${firstIdea._id}/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .end((err, res) => {
                    const code = 204;
                    expect(res.status).to.equal(code);
                    expect(res.ok).to.equal(true);
                    done();
                });
        });

        it('Should delete an idea again', function(done) {
            chai.request(app)
                .delete(`/api/v1/ideas/${firstIdea._id}/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .end((err, res) => {
                    const code = 404;
                    expect(res.status).to.equal(code);
                    expect(res.ok).to.equal(false);
                    done();
                });
        });

        it('Should not delete (idea does not belong to user)', function(done) {
            chai.request(app)
                .delete(`/api/v1/ideas/${secondIdea._id}/user/${firstUser._id}`)
                .set('Authorization', 'Bearer ' + validLoginToken)
                .end((err, res) => {
                    const resError = res.body.response.error;
                    const code = 401;
                    const apiRoute =
                    `/api/v1/ideas/${secondIdea._id}/user/${firstUser._id}`;

                    expect(res.status).to.equal(401);
                    baseExpect(res.body, code, apiRoute, false, 'DELETE');
                    expect(res.body.response).to.have.property('error');
                    expect(resError).to.not.be.undefined;
                    done();
                });
        });
    });
});
