/**
 * Use a standard format response for all api endpoints.
 * @class ResponseObject
 * @author Akim Benchiha
 */
class ResponseObject {

    /**
     * @param  {string} responseCode - HTTP code
     * @param  {string} responseData - response data format in JSON
     * @param  {string} apiURL - endpoint called
     * @author Akim Benchiha
     * @constructor
     */
    constructor(responseCode, responseData, apiURL) {
        this.responseCode = responseCode
        this.responseData = responseData
        this.apiURL = apiURL
    }
    /**
     * @description return the JSON of the response
     * @param  {} isSuccess - Is it an error response or a success response
     * @public
     */
    returnResponse(isSuccess) {
        return {
            "code": this.responseCode,
            "success": isSuccess,
            "apiURL": this.apiURL,
            "data": this.responseData,
            'timestamps': Date.now()
        }
    }
}

export default ResponseObject;