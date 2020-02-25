import express from "express";
import _ from "lodash";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import userSettingsRoute from "./userSettings";
import ResponseObject from "../../helpers/response";
import { User } from "../../Models/User/userModel";
import { validateBody, UserRegisterSchemaValidation, UserLoginSchemaValidation } from '../../helpers/inputValidation';
import passportConf, { signToken } from '../../helpers/authToken'

const router = express.Router();

router.use("/settings", passport.authenticate('jwt', { session: false }), userSettingsRoute);

router.get("/", async (req, res, next) => {
    let responseObject;

    const users = await User.find().select('-_id -__v -password');
    responseObject = new ResponseObject(
        200,
        { users: users },
        _.get(req, "originalUrl", "Cannot retrieve api url")
    );
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
});

router.get("/:id", async (req, res, next) => {

    const user = await User.findOne({ _id: _.get(req, "params.id") }).select('-_id -__v -password');
    let responseObject = new ResponseObject(
        200,
        { user: user },
        _.get(req, "originalUrl", "Cannot retrieve api url")
    );
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
});


router.post("/register", validateBody(UserRegisterSchemaValidation), async (req, res, next) => {
    let responseObject

    const user = new User({
        username: _.get(req, "body.username"),
        firstname: _.get(req, "body.firstname"),
        lastname: _.get(req, "body.lastname"),
        email: _.get(req, "body.email"),
        age: _.get(req, "body.age", ""),
        password: _.get(req, "body.password")
    });

    //Checking if the user is already inside the database
    const emailOrUsernameCheckExist = await User.findOne({
        $or: [
            { email: user.email },
            { username: user.username },
        ]
    });

    if (emailOrUsernameCheckExist) {
        responseObject = new ResponseObject(400, { error: "Email or Username already exist" }, _.get(req, "originalUrl", "Cannot retrieve api url"))
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
    }

    const savedUser = await user.save();
    savedUser.toJSON()
    const { _id, username, firstname, lastname, email, age } = savedUser
    const token = signToken(savedUser)

    responseObject = new ResponseObject(201,
        { response: { token, _id, username, firstname, lastname, email, age } },
        _.get(req, "originalUrl", "Cannot retrieve api url"))
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));

});


router.post("/login", validateBody(UserLoginSchemaValidation), passport.authenticate('local', { session: false }), async (req, res, next) => {
    let responseObject;
    const { _id, username, firstname, lastname, email, age } = req.user
    //Create and assign token
    const token = signToken(req.user)
    responseObject = new ResponseObject(200,
        { response: { token, _id, username, firstname, lastname, email, age } },
        _.get(req, "originalUrl", "Cannot retrieve api url"));
    res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
});




export default router;
