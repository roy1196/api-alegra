const axios = require('axios').default;
const https = require('https');
const axiosRetry = require('axios-retry');

class AxiosHelper {

    constructor() {
    }

    async makeRequest(url, method = "GET", headers = {}, params = {}, data = {}) {
        console.log("🚀 ~ file: axios-helper.js ~ line 10 ~ AxiosHelper ~ makeRequest ~ url", url)
        console.log("🚀 ~ file: axios-helper.js ~ line 10 ~ AxiosHelper ~ makeRequest ~ headers", headers)
        axiosRetry(axios, {
            retries: 3, // number of retries
            retryDelay: (retryCount) => {
              console.log(`retry attempt: ${retryCount}`);
              return retryCount * 2000; // time interval between retries
            },
            retryCondition: (error) => {
              // if retry condition is not specified, by default idempotent requests are retried
              return error.response.status === 503 || error.response.status === 500;
            },
          });

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