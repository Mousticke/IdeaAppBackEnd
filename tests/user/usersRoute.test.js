import request from 'supertest';
import app from '../../src';


describe('User route endpoints', () => {
    it('should create a new user', async () => {
        return await request(app)
            .post('/api/v1/users/register')
            .send({
                'username': 'Test user 2',
                'firstname': 'Akim',
                'lastname': 'Benchiha',
                'email': 'test2.benchiha@test.com',
                'age': '11.18.1995',
                'password': '123456',
            }).then((callback) => {
                expect(callback.status).toEqual(400);
                expect(callback.body).toHaveProperty('response');
            });
    });
});
