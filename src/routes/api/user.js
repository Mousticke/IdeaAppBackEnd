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
    let responseObject;

    const users = await User.find();
    responseObject = new ResponseObject(
        200,
        { users: users },
        _.get(req, "originalUrl", "Cannot retrieve api url")
    );
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
});

router.get("/:id", async (req, res, next) => {

    const user = await User.findOne({ _id: _.get(req, "params.id") });
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
    const { username, firstname, lastname, email, age, createdAt, updatedAt } = savedUser
    responseObject = new ResponseObject(201,
        { response: { username, firstname, lastname, email, age, createdAt, updatedAt } },
        _.get(req, "originalUrl", "Cannot retrieve api url"))
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));

});


router.post("/login", validateBody(UserLoginSchemaValidation), async (req, res, next) => {
    let responseObject;

    const user = new User({
        username: _.get(req, "body.username"),
        password: _.get(req, "body.password")
    });

    //Checking if the user exists inside the database and password is correct
    const searchUser = await User.findOne({ username: user.username });
    const isMatchPassword = await searchUser.isValidPassword(user.password)

    if (!searchUser || !isMatchPassword) {
        responseObject = new ResponseObject(400, { error: "Password or Username incorrect" }, _.get(req, "originalUrl", "Cannot retrieve api url"));
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
    }

    const { username, firstname, lastname, email, age, createdAt, updatedAt } = searchUser

    //Create and assign token
    const token = jwt.sign({ _id: _.get(searchUser, "_id") }, process.env.JWT_TOKEN, { expiresIn: '20s' });

    responseObject = new ResponseObject(200,
        { response: { token, username, firstname, lastname, email, age, createdAt, updatedAt } },
        _.get(req, "originalUrl", "Cannot retrieve api url"));
    return res.send(responseObject.returnResponse(true)).status(responseObject.responseCode);

});

export default router;
