//Models
const errorCodes = require('../config/error-messages.json');

//Helpers
const Validator = require('../utils/validator');

class BaseController {
    constructor() {
        /**@private @type {string[]} */
        this._eMessages = [];

        /**@private @type {boolean} */
        this._errorCode = 0;

        this._validator = new Validator();
        this._response;
    }

    /**
     * Returns a valid JSON of the actual controller state.
     * @private
     * @return {{errorCode: (boolean), eMessages: (Array), response: (Array)}}
     */
    _getObject() {
        let response = {
            errorCode: this._errorCode,
            eMessages: this._eMessages,
            response: this._response || []
        };
        // console.log("TCL: BaseController -> _getObject -> response", response)

        return response;
    }

    /**
     * Used to add a new message to the error messages array.
     * @param {!Number} errCode Database error code.
     * @param {null=} fields Fields to add in the error messages.
     * @protected
     * @type {Promise<Void>}
     */
    async _addMessage(errCode, fields = null) {
        Array.isArray(this._eMessages) ? this._eMessages.push(`${await this._getMessage(errCode)}${fields !== null ? (' ' + Object.keys(fields).join(', ')) : ''}`) : null;
    }

    async _addMessageByText(messageError, fields = null) {
        Array.isArray(this._eMessages) ? this._eMessages.push(messageError)  : null;
        // console.log("TCL: BaseController -> _addMessage -> this._eMessages", this._eMessages)
    }

    /**
     * Find an error message in the database, based on the message code, and the controller language.
     * @param {!Number} messageCode Database error code.
     * @protected
     * @return {Promise<String>}
     */
    async _getMessage(messageCode) {
        return errorCodes[messageCode || '500'];
    }

    /**
     * Controller's main function, used to execute onValidate and onSave functions.
     * This function also returns a response to the client, it can be:
     * -An Error(500)
     * -A Request sintaxis error(400) 
     * -A Success response(200) with a json fron the onSave function
     * Cliente response will ALWAYS be an array of strings or objects.
     * Also, save function will handle all errors that may occur in the save process.
     * @param {!Response} res The response object from Express Router.
     * @type {Promise<Void>}
     * @public
     */
    async save(res) {
        try {
            if (await this._onValidate()) {
                this._response = await this._onSave();
                this._errorCode = this._eMessages.length > 0 ? 1 : 0;
                res.json(this._getObject());
            } else {
                this._errorCode = 1;
                res.status(400).json(this._getObject());
            }
        } catch (e) {
            const errCode = e.status || 500;
            global.ErrorLogger.newError(e);
            this._errorCode = 1;
            // console.log("TCL: BaseController -> save -> errCode", errCode)
            await this._addMessage(errCode);
            res.status(errCode).json(this._getObject());
        }
    }

    /**
     * Overrideable method, use to make validations of the recived data(fields).
     * @protected
     * @return {Promise<boolean>}
     */
    async _onValidate() {
        return true;
    }

    /** 
     * Overrideable method, use to execute the save process of the controller. Has to returns an Array of either Strings or Objects.
     * @protected
     * @return {Promise<Array>}
     */
    async _onSave() {
        return [];
    }
}

module.exports = BaseController;