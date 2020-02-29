import request from 'supertest';
import app from '../../src/index';
import mongoose from 'mongoose';

describe('Post model Endpoints', () => {
    afterAll(async (done) => {
        app.close();
        await mongoose.connection.close();
    });

    it('should try to post a user', async () => {
        const res = await request(app)
            .post('/api/v1/users/register')
            .send({
                'username': 'Test user 2',
                'firstname': 'Akim',
                'lastname': 'Benchiha',
                'email': 'test2.benchiha@test.com',
                'age': '11.18.1995',
                'password': '123456',
            });

        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('response');
    });
});
