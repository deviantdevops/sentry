const settings = {
    development: {
        PORT: 7006,
        API: {
            CRYPT:'http://localhost:7001',
            USER:'http://localhost:7003',
        },
        REDIS:{
            HOST: "",
            PASS: ""
        },
    },

    staging: {
        PORT: 7006,
        API: {
            CRYPT:'http://api_crypt:7001',
            USER:'http://api_user:7003',
        },
        REDIS:{
            HOST: "",
            PASS: ""
        }, 
    },

    production: {
        PORT: 7006,
        API: {
            CRYPT:'http://localhost:7001',
            USER:'http://localhost:7003',
        },
        REDIS:{
            HOST: "",
            PASS: ""
        },
    }
};

const config = () => {
    let configuration = settings[process.env.NODE_ENV];
    configuration.APP_NAME = 'Deviant Sentry';
    configuration.COMPANY_NAME = 'Deviant.Code';
    configuration.COMPANY_URL = 'https://deviant.code';
    global.config = configuration;
}

module.exports = config();