import app from '../../src/';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {User} from '../../src/Models/User/userModel';

chai.use(chaiHttp);
const {expect} = chai;

const mongoObjectId = function() {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

describe('User Endpoints ', function() {
    let firstUser;
    let secondUser;

    beforeEach(function(done) { // Before each test we empty the database
        User.deleteMany({}, (err) => {
            done();
        });
        const firstUserPromise = new Promise((resolve, reject) => {
            resolve(new User({
                'username': 'Mousticke',
                'firstname': 'Akim',
                'lastname': 'Benchiha',
                'email': 'akim.benchiha@test.com',
                'age': '11.18.1995',
                'password': '123456',
            }));
        });

        const secondUserPromise = new Promise((resolve, reject) => {
            resolve(new User({
                'username': 'Mousticke_2',
                'firstname': 'Akim',
                'lastname': 'Benchiha',
                'email': 'akim2.benchiha@test.com',
                'age': '11.18.1995',
                'password': '123456',
            }));
        });
        Promise.all([firstUserPromise, secondUserPromise]).then((user)=>{
            firstUser = user[0];
            secondUser = user[1];
            firstUser.save();
            secondUser.save();
        });
    });


    describe('/GET users', function() {
        it('it should GET all the users', function(done) {
            chai.request(app)
                .get('/api/v1/users')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.be.undefined;
                    expect(res.body).to.have.property('response');
                    expect(res.body.response).to.be.an('object');
                    expect(res.body.response).to.have.property('data');
                    expect(res.body.response.data).to.not.be.undefined;
                    expect(res.body.response.data).to.be.an('array');
                    expect(res.body.response.data).to.have.lengthOf(2);
                    done();
                });
        });
    });

    describe('/GET users with an id', function() {
        it('it should GET a user', function(done) {
            chai.request(app)
                .get('/api/v1/users/' + firstUser._id)
                .end((err, res) => {
                    const resData = res.body.response.data;

                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.be.undefined;
                    expect(res.body).to.have.property('response');
                    expect(res.body.response).to.be.an('object');
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

        it('should return a Bad request : id is not valid', function(done) {
            const currentID = mongoObjectId();
            chai.request(app)
                .get('/api/v1/users/' + currentID)
                .end((err, res) => {
                    const resData = res.body.response.data;
                    const apiRoute = '/api/v1/users/' + currentID;

                    expect(res.status).to.equal(400);
                    expect(res.body).to.not.be.undefined;
                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.equal(400);
                    expect(res.body).to.have.property('method');
                    expect(res.body.method).to.equal('GET');
                    expect(res.body).to.have.property('apiURL');
                    expect(res.body.apiURL).to.equal(apiRoute);
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('response');
                    expect(res.body.response).to.be.an('object');
                    expect(res.body.response).to.have.property('error');
                    expect(resData).to.be.undefined;
                    done();
                });
        });
    });

    /* describe('/POST log in a user', function() {
        it('it should login a user an return a valid token', function(done) {
            chai.request(app)
                .post('/api/v1/users/login')
                .end((err, res) => {
                    const resData = res.body.response.data;

                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.be.undefined;
                    expect(res.body).to.have.property('response');
                    expect(res.body.response).to.be.an('object');
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
    });*/
});
