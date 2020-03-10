/**
 *
 *
 * @class ExistingError
 * @extends {Error}
 */
export default class ExistingError extends Error {
    /**
     *Creates an instance of ExistingError.
     * @param {*} message
     * @memberof ExistingError
     */
    constructor(message) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExistingError);
        }

        this.name = 'ExistingError';
    }
}
