/**
 *
 *
 * @class ValidationError
 * @extends {Error}
 */
export default class ValidationError extends Error {
    /**
     *Creates an instance of ValidationError.
     * @param {*} message
     * @param {*} validationErrors
     * @memberof ValidationError
     */
    constructor(message, validationErrors) {
        super(message);
        this.validationErrors = validationErrors;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }

        this.name = 'ValidationError';
    }
}
