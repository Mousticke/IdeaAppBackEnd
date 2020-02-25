import express from "express";
import bcrypt from 'bcryptjs'
import _ from "lodash";
import passport from 'passport';
import userSettingsRoute from "./userSettings";
import ResponseObject from "../../helpers/response";
import { User } from "../../Models/User/userModel";
import { validateBody, UserRegisterSchemaValidation, UserLoginSchemaValidation, UserInformationSchemaValidation } from '../../helpers/inputValidation';
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

    const user = await User.findById(_.get(req, "params.id")).select('-__v -password');
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


router.put("/:id", validateBody(UserInformationSchemaValidation), passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    let responseObject

    const repeatPassword = _.get(req, "body.repeatPassword", "")

    const user = new User({
        username: _.get(req, "body.username"),
        firstname: _.get(req, "body.firstname"),
        lastname: _.get(req, "body.lastname"),
        email: _.get(req, "body.email"),
        age: _.get(req, "body.age", ""),
        password: _.get(req, "body.password"),
    });

    if(user.password !== repeatPassword){
        return res.status(400).send("Password doesn't match");
    }else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
    }
    const { _id, username, firstname, lastname, email, age } = user
    delete user.updateAt
    try {
        await User.findByIdAndUpdate({_id: req.params.id}, { $set: {username, firstname, lastname, email, age}}, {new: false});
    } catch (error) {
        responseObject = new ResponseObject(400,
            { error: error  },
            _.get(req, "originalUrl", "Cannot retrieve api url"))
        return res.status(responseObject.responseCode).send(responseObject.returnResponse(false));
    }
    responseObject = new ResponseObject(201,
        { response: { _id, username, firstname, lastname, email, age } },
        _.get(req, "originalUrl", "Cannot retrieve api url"))
    return res.status(responseObject.responseCode).send(responseObject.returnResponse(true));
});

export default router;
