/**
 *
 *
 * @class BadRequestError
 * @extends {Error}
 */
export default class BadRequestError extends Error {
    /**
     *Creates an instance of BadRequestError.
     * @param {*} message
     * @memberof BadRequestError
     */
    constructor(message) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BadRequestError);
        }

        this.name = 'BadRequestError';
    }
}
