import app from '../../src/';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {User} from '../../src/Models/User/userModel';

chai.use(chaiHttp);
const {expect} = chai;

describe('User Endpoints ', function() {
    beforeEach(function(done) { // Before each test we empty the database
        User.deleteMany({}, (err) => {
            done();
        });
        User.create({
            'username': 'Mousticke',
            'firstname': 'Akim',
            'lastname': 'Benchiha',
            'email': 'akim2.benchiha@test.com',
            'age': '11.18.1995',
            'password': '123456',
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
                    expect(res.body.response.data).to.have.lengthOf(1);
                    console.log(res.body);
                    done();
                });
        });
    });
});
