import express from 'express';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import ResponseObject from '../../helpers/response';
import { UserSetting } from "../../Models/User/userSettingModel";
import passportConf from '../../helpers/authToken'

const router = express.Router({ mergeParams: true });
//const passportJwt = passport.authenticate('jwt', {session: false})


const passportJwt = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err || !user) {
            let responseObject = new ResponseObject(401, { error: "Unauthorized request" },  _.get(req, "originalUrl", "Cannot retrieve api url"));
            return res.status(401).send(responseObject.returnResponse(false));          
        }else{
            req.user = user
        }
        next();
    })(req, res);
}


router.get('/', passportJwt, async (req, res, next) => {
    let responseObject;
    const userSettings = await UserSetting.findOne({userID: req.user._id}).populate('userID', '-password');
    responseObject = new ResponseObject(
        200,
        { userSettings: userSettings, token: _.get(req, "token") },
        _.get(req, "originalUrl", "Cannot retrieve api url")
    );
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
});

export default router;