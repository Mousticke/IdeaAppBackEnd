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
     * @param  {string} method - http verb
     * @author Akim Benchiha
     * @constructor
     */
    constructor(responseCode, responseData, apiURL, method) {
        this.responseCode = responseCode
        this.responseData = responseData
        this.apiURL = apiURL
        this.method = method
    }

    /**
     * @description return the JSON of the response
     * @param  {} isSuccess - Is it an error response or a success response
     * @public
     */
    returnResponseData(isSuccess) {
        let response = {}
        if (isSuccess)
            response = {
                "data": this.responseData
            }

        else {
            response = {
                "error": this.responseData
            }
        }

        return (responseAPI) => {
            let baseResponse ={
                "code": this.responseCode,
                "method": this.method,
                "apiURL": this.apiURL,
                'timestamps': Date.now()
            }
            let constructedResponse = Object.assign({}, baseResponse, { success: isSuccess, response });
            return responseAPI.status(this.responseCode).send(constructedResponse)
        }
    }
}


export default ResponseObject;