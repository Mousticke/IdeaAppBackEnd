/**
 *
 *
 * @class NotFoundError
 * @extends {Error}
 */
export default class NotFoundError extends Error {
    /**
     *Creates an instance of NotFoundError.
     * @param {*} message
     * @memberof NotFoundError
     */
    constructor(message) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFoundError);
        }

        this.name = 'NotFoundError';
    }
}
