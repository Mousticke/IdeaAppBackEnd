import express from 'express';
import morgan from 'morgan';
import _ from 'lodash';
import cors from 'cors';
import swaggerUi  from 'swagger-ui-express'
import swaggerDocument from './swagger.json'
import dotenv from 'dotenv';
import api from './routes';


dotenv.config();
const app = express();
const router = express.Router()

app.use(cors());
app.use(morgan("dev"));

const redirectHome = (req, res, next) =>{
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

app.listen(3000, ()=>{
    console.debug(`Server host : ${process.env.HOST} started on port ${process.env.PORT || 3000}`);
});

export default app;