const REDISSERVICE = require('../services/redisService')

/**
 * This middleware should check the REDIS cache for the same request prior to calling the 
 * other API services. This should save a lot of time especially for long running requests
 * 
 */
module.exports = {

    checkCache: async (req, res, next) => {


        return next();

        let query = req.body;
        if(req.method === 'GET'){
            query = req.query
        }

        let methodGetCache = false;
        if(req.method === 'GET' || req.method === 'POST'){
            methodGetCache = true;
        }

        if(
            methodGetCache === true && 
            req.headers['x-get-cache'] !== undefined && 
            req.headers['x-get-cache'] === 'true'
        ){
            console.log('CACHE MIDDLEWARE, GETTING CACHED DATA')
            REDISSERVICE.get(req, query)
            .then(cachedRequest => {
                console.log('FOUND CACHED REQUEST')
                return res.status(200).json(cachedRequest).end();
            })
            .catch(err => {
                console.log('REDIS ERROR OR NULL VALUE. GETTING FRESH DATA INSTEAD', err)
                return next();
            })
            
        }else{
            console.log('CACHE MIDDLEWARE, GETTING FRESH DATA')
            return next();
        }
    }

}