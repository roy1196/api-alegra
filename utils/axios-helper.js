const axios = require('axios').default;
const https = require('https');

class AxiosHelper {

    constructor() {
    }

    async makeRequest(url, method = "GET", headers = {}, params = {}, data = {}) {
        try {
            let res = await axios({
                method,
                url,
                headers: headers,
                params,
                data,
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            if(typeof res.data == 'string'){
                return this.sendResponse(res.status,res.data, {...res, isError:false});
            }
    
            return this.sendResponse(res.status,{...res.data, isError:false}, {...res, isError:false});
        } catch (error) {
            console.log("🚀 ~ file: axiosHelper.js ~ line 23 ~ AxiosHelper ~ makeRequest ~ error", error.response);
            console.log("🚀 ~ file: axiosHelper.js ~ line 23 ~ AxiosHelper ~ makeRequest ~ error", JSON.stringify(error.response));
            return this.sendResponse(error.response.status, {...error.response.data, isError:true}, {...error.response.data, isError:true})
        }
    }

    async sendResponse(status, data, response) {
        if (status == 200) {
            return data;
        } else {
            return response;
        }
    }
}

module.exports = AxiosHelper;