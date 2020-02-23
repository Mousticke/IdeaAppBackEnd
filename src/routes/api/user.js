import express from "express";
import _ from "lodash";
import jwt from 'jsonwebtoken';
import userSettingsRoute from "./userSettings";
import ResponseObject from "../../helpers/response";
import { User } from "../../Models/User/userModel";
import { validateBody, UserRegisterSchemaValidation, UserLoginSchemaValidation } from '../../helpers/inputValidation';

const router = express.Router();

router.use("/:id/settings", userSettingsRoute);

router.get("/", async (req, res, next) => {
    try {
        const users = await User.find();
        let responseObject = new ResponseObject(
            200,
            { users: users },
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
    } catch (error) {
        let responseObject = new ResponseObject(
            400,
            _.get(error, "message", "Bad Request"),
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: _.get(req, "params.id") });
        let responseObject = new ResponseObject(
            200,
            { user: user },
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
    } catch (error) {
        let responseObject = new ResponseObject(
            400,
            error,
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
    }
});


router.post("/register", validateBody(UserRegisterSchemaValidation), async (req, res, next) => {
    let responseObject = new ResponseObject();
    try {
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
            responseObject.apiURL = _.get(req, "originalUrl", "Cannot retrieve api url")
            responseObject.responseCode = 400
            responseObject.responseData = { error: "Email or Username already exist" }
            return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
        }

        const savedUser = await user.save();
        const { username, firstname, lastname, email, age, createdAt, updatedAt } = savedUser
        responseObject.apiURL = _.get(req, "originalUrl", "Cannot retrieve api url")
        responseObject.responseCode = 201
        responseObject.responseData = { response: { username, firstname, lastname, email, age, createdAt, updatedAt } }
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));

    } catch (error) {
        responseObject.apiURL = _.get(req, "originalUrl", "Cannot retrieve api url")
        responseObject.responseCode = 400
        responseObject.responseData = error
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
    }

});


router.post("/login", validateBody(UserLoginSchemaValidation), async (req, res, next) => {
    let responseObject = new ResponseObject();
    try {
        const user = new User({
            username: _.get(req, "body.username"),
            password: _.get(req, "body.password")
        });

        //Checking if the user exists inside the database and password is correct
        const searchUser = await User.findOne({ username: user.username });
        const isMatchPassword = await searchUser.isValidPassword(user.password)

        if (!searchUser || !isMatchPassword) {
            responseObject.apiURL = _.get(req, "originalUrl", "Cannot retrieve api url")
            responseObject.responseCode = 400
            responseObject.responseData = { error: "Password or Username incorrect" }
            return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
        }

        const {username, firstname, lastname, email, age, createdAt, updatedAt } = searchUser
        
        //Create and assign token
        const token = jwt.sign({_id: _.get(searchUser, "_id")}, process.env.JWT_TOKEN, {expiresIn: '20s'});

        responseObject.apiURL = _.get(req, "originalUrl", "Cannot retrieve api url")
        responseObject.responseCode = 200
        responseObject.responseData = { response: { token, username, firstname, lastname, email, age, createdAt, updatedAt } }
        return res.send(responseObject.returnResponse(true)).status(responseObject.responseCode);

    } catch (error) {
        responseObject.apiURL = _.get(req, "originalUrl", "Cannot retrieve api url")
        responseObject.responseCode = 400
        responseObject.responseData = error
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
    }

});

export default router;
