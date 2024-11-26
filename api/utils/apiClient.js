const axios = require('axios');
const operationLog = require("./logHandler").operationLog;

const apiClient = (apiEndPoint, apiHeader) => {
    const api = axios.create({
        baseURL: apiEndPoint,
        headers: {
            ...apiHeader,
        },
    });

    api.interceptors.request.use(async (config) => {
        // const section = config.metadata?.section ?? '';
        // console.log('loggedInUserId',loggedInUserId);
        
        let logData={
            // user:loggedInUserId ?? null,
            section: config.metadata?.section ?? '',
            request: JSON.stringify(config.data),
            url: `${config.baseURL}${config.url}`,
        };
        if(loggedInUserId) logData.user=loggedInUserId
        // const opId = await operationLog({ section, request: JSON.stringify(config.data), url: `${config.baseURL}${config.url}` });
        const opId = await operationLog(logData);
        config.metadata = {
            ...config.metadata,
            opId,
        };
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    api.interceptors.response.use(async (response) => {
        const { config, data } = response;
        await operationLog({ response: JSON.stringify(data) }, config.metadata.opId);
        return response;
    }, (error) => {
        return Promise.reject(error);
    });

    return api;
};

module.exports = apiClient;
