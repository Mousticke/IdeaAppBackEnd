import express from "express";
import _ from "lodash";
import userSettingsRoute from "./userSettings";
import ResponseObject from "../../helpers/response";
import { User } from "../../Models/User/userModel";

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
        return res.send(responseObject.returnResponse(true)).status(responseObject.responseCode);
    } catch (error) {
        let responseObject = new ResponseObject(
            400,
            _.get(error, "message", "Bad Request"),
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        res.send(responseObject.returnResponse(false)).status(responseObject.responseCode);
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
        return res.send(responseObject.returnResponse(true)).status(responseObject.responseCode);
    } catch (error) {

        let responseObject = new ResponseObject(
            400,
            _.get(error, "message", "Bad Request"),
            _.get(req, "originalUrl", "Cannot retrieve api url")
        );
        res.send(responseObject.returnResponse(false)).status(responseObject.responseCode);
    }
});

export default router;
