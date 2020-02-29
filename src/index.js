import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import bodyParser from 'body-parser';
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

//:${process.env.DB_PORT}/${process.env.DB_TABLE}
connectMongoDB(`${process.env.REMOTE_DB_HOST}`)
    .catch(error => {
        console.error(error)
        closeMongoDB()
    });

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ // Middleware
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(passport.initialize())


const redirectHome = (req, res, next) => {
    if (_.get(req, "originalUrl") == '/')
        res.redirect('/api/v1');
    next();
}

router.use(function (req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path)
    next()
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', api);
app.use(redirectHome);


app.get('*', (req, res, next) => {
    let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`); // Tells us which IP tried to reach a particular URL
    err.statusCode = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    if (!err.statusCode) err.statusCode = 500; // Sets a generic server error status code if none is part of the err
    res.status(err.statusCode).send(err); // If shouldRedirect is not defined in our error, sends our original err data
});

app.listen(3000, () => {
    console.debug(`Server host : ${process.env.HOST} started on port ${process.env.PORT || 3000}`);
});

export default app;