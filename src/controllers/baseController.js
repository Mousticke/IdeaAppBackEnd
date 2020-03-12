import ResponseObject from '../helpers/response/response';
import _ from 'lodash';

/**
 * Class that represent a controller
 *
 * @class Controller
 */
export default class Controller {
    /**
     *Creates an instance of Controller.
     * @param {*} service
     * @memberof Controller
     */
    constructor(service) {
        this.responseObject = new ResponseObject();
        this.apiRoute = '';
        this.apiMethod = '';
        this.service = service;
    }

    /**
     * Return the api information used for the response
     *
     * @param {*} req
     * @memberof Controller
     */
    apiInformation(req) {
        this.apiRoute = _.get(req, 'originalUrl');
        this.apiMethod = _.get(req, 'method');
    }

    /**
     *Call response object
     *
     * @param {*} httpCode
     * @param {*} data
     * @param {*} apiRoute
     * @param {*} apiMethod
     * @param {*} isSuccess
     * @param {*} response
     * @return {ResponseObject}
     * @memberof Controller
     */
    callResponseObject(httpCode, data, apiRoute,
        apiMethod, isSuccess, response) {
        this.responseObject.method = apiMethod;
        this.responseObject.apiURL = apiRoute;
        this.responseObject.responseCode = httpCode;
        return this.responseObject.constructResponse(data, isSuccess, response);
    }
}
