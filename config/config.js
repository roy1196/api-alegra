let environmentName;
const { env } = process;
//console.log("TCL: environmentName", env[`DEV_API_APP_NODES`])
switch (env.NODE_ENV) {
    case 'development':
        environmentName = 'DEV';
        break;
    case 'stage':
        environmentName = 'STG';
        break;
    case 'production':
        environmentName = 'PROD';
        break;
    default:
        throw new Error('Invalid environment name');
}

module.exports = {
    cors: {
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'user',
            'pass',
            'apikey'
        ]
    },
    alegra: {
        url: env.ALEGRA_URL_BASE,
        user: env.ALEGRA_USER_API,
        token: env.ALEGRA_TOKEN_API
    }
}