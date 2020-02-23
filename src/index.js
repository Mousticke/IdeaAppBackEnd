import express from 'express';
import morgan from 'morgan';
import _ from 'lodash';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'
import api from './routes';
import { connectMongoDB, closeMongoDB } from './config/database/mongoDB'

dotenv.config();
const app = express();
const router = express.Router()

connectMongoDB(`${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_TABLE}`)
    .catch(error => {
        console.error(error)
        closeMongoDB()
    });
    
app.use(cors());
app.use(morgan("dev"));

const redirectHome = (req, res, next) => {
    if (_.get(req, "originalUrl") == '/')
        res.redirect('/api/v1');
    next();
}

router.use(function (req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path)
    next()
});

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', api);
app.use(redirectHome);

app.listen(3000, () => {
    console.debug(`Server host : ${process.env.HOST} started on port ${process.env.PORT || 3000}`);
});

export default app;