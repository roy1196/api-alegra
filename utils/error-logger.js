const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

class ErrorLogger {
    /**
     * Global helper for log all the errors that may occur in the entire API.
     */
    constructor() {
        this.errorFolderPath = path.join(__dirname, '../error');
        this.detailsFolderPath = path.join(__dirname, '../error/details');

        this._createPath();

        if (process.env.NODE_ENV === 'development') {
            this.clearErrors();
        }
    }

    _createPath() {
        try {
            const paths = [this.errorFolderPath, this.detailsFolderPath];
            for (const path of paths) {
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
            }
        } catch (err) {
        }
    }

    /**
     * Retuns a unique ID for the error details file.
     * @private
     * @return {String}
     */
    _getUniqueId() {
        return uuid.v1();
    }

    /**
     * Retuns the name of the errors .json file, with the date when the errors happen.
     * @private
     * @return {String}
     */
    _getJsonName(date) {
        return `errors-${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }.json`;
    }

    /**
     * Get the name for the error detaild file.
     * @private
     * @return {String}
     */
    _getDetailsName(date) {
        return `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }-${ this._getUniqueId() }.log`
    }

    /**
     * Get the json format for an error.
     * @private
     * @return { String }
     */
    _getJson(date, err, file) {
        return JSON.stringify({
            date,
            message: err.message,
            file,
        });
    }

    /**
     * Add a new error to the .json error log of the day.
     * @param {Error} err
     * @public
     * @type {Void}
     */
    newError(err) {
        const date = new Date();
        const jsonFileName = `${ this.errorFolderPath }/${ this._getJsonName(date) }`;
        const detailsFileName = `${ this.detailsFolderPath }/${ this._getDetailsName(date) }`;
        const error = this._getJson(date, err, detailsFileName);

        if (fs.existsSync(jsonFileName)) {
            fs.appendFile(jsonFileName, error, (err) => err && console.error(err));
        } else {
            fs.writeFile(jsonFileName, error, (err) => err && console.error(err));
        }

        fs.writeFile(detailsFileName, err.stack, (err) => err && console.error(err));
    }

    /**
     * Clear all the errors in the error log path.
     * @public
     * @type {Void}
     */
    clearErrors() {
        try {
            fs.readdir(this.errorFolderPath, (err, files) => files.map(file =>  fs.statSync(`${ this.errorFolderPath }/${ file }`).isFile() && fs.unlinkSync(`${ this.errorFolderPath }/${ file }`)));
            fs.readdir(this.detailsFolderPath, (err, files) => files.map(file => fs.statSync(`${ this.detailsFolderPath }/${ file }`).isFile() && fs.unlinkSync(`${ this.detailsFolderPath }/${ file }`)))
        } catch(err) {
            console.error(err)
        }
        
    }
}

module.exports = new ErrorLogger();