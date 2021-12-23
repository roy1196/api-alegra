class Validator {
    constructor() {}
    /**
     * Validate the given field has a valid value,
     * @param {Object} fields 
     * @param {Function} addMessageFunction 
     */
    async required(fields, addMessageFunction) {
        for (const key in fields) {
            if (fields[key] === null || typeof fields[key] === 'undefined') {
                await addMessageFunction(global.config.messageCodes.err.requiredFields, fields);
                return false;
            }
        }
        return true;
    }

    async matchValues(data,addMessageFunction, ...values){
        let isOk = false;
        if(values.length > 0){
            for (let i = 0; i < values.length; i++) {
                const element = values[i];
                if(element == data){
                    isOk = true;
                    break;
                }
            }
        }
        if(!isOk){
            await addMessageFunction(global.config.messageCodes.err.missingOrIncorrectInfo)
        }
        return isOk;
    }

    /**
     * Validate the given field has a valid lenght,
     * @param {string} value 
     * @param {int} size 
     */
    size(value, size) {
        return value.length == size;
    }
}

module.exports = Validator;