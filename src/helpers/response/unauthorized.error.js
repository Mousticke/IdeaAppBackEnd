/**
 *
 *
 * @class UnauthorizedError
 * @extends {Error}
 */
export default class UnauthorizedError extends Error {
    /**
     *Creates an instance of UnauthorizedError.
     * @param {*} message
     * @memberof UnauthorizedError
     */
    constructor(message) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnauthorizedError);
        }

        this.name = 'UnauthorizedError';
    }
}
