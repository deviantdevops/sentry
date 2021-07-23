/**
 * Authenticating a user needs to get the USER ACCESS TOKEN form the Authorization
 * headers. Then call Crypt and validate the token. THat shall return a token payload
 * including the user token. Now call the User API and get the user and insert into 
 * the request.
 */
const axios = require('axios');
const requestIp = require('request-ip');

module.exports = {
    /**
     * Validate a User Auth token and insert the user into the request header
     */
    user: (req, res, next) => {
        console.log('USER AUTHMIDDLEWARE')
        if(req.headers.authorization !== undefined){
            let access_token = req.headers.authorization.split(' ')[1];
            axios({
                url: `${global.config.API.CRYPT}/validate`,
                method: 'post',
                headers: {},
                data: {'payload': access_token},
            }).then( async (response) => {
                if(
                    response.data.decoded === undefined || 
                    response.data.decoded.data === undefined ||
                    response.data.decoded.data.payload === undefined
                ){
                    return res.status(401).send('Authentication Middleware 49: A valid user access_token is required').end();
                }
                //console.log(response.data.decoded.data.payload)
                let user_token = response.data.decoded.data.payload.user_token;
                let user = null;
                try{
                    user = await axios.get(`${global.servers.user}/user?user_token=${user_token}`);
                    if(user !== null){
                        delete user.data.password;
                        req.headers['x-user'] = JSON.stringify(user.data);
                        req.headers.authorization = null;
                        console.log('USER VALIDATION WAS SUCCESSFUL.');
                        return next();
                    }else{
                        console.log('A VALID USER WAS NOT RETURNED')
                        return res.status(401).send('Authentication Middleware 66: A valid user access_token is required').end();
                    }
                }catch(error){
                    console.log('CLIENT SERVER ERROR')
                    return res.status(401).send('Authentication Middleware 70: A valid user access_token is required').end();
                } 
            })
        }else{
            /**
             * No user header so not need to check anything
             */
            console.log('NO USER HEADER')
            next();
        }
    },
    /**
     * 1. Validate a client key
     * 2. If valid return a client object
     * 3. Cache the client for 24 hours
     */
    client: (req, res, next) => {
        console.log('KEYVALIDATOR MIDDLEWARE')
        console.log('Received a request from: ',req.hostname)
        let client_key = req.headers['x-client-key'];
        if(client_key === undefined || client_key === null){
            /**
             * If no header then reject
             */
            return res.status(401).send('Invalid x-client-key header').end();
        }
        /**
         * Validate the key signature and decode/decrypt the payload
         */
        axios({
            url: `${global.config.API.CRYPT}/validate`,
            method: 'post',
            headers: {},
            data: {'payload': client_key},
        }).then( async (response) => {
            /**
             * If there was a failure return 401
             */
            if(
                response.data.decoded === undefined || 
                response.data.decoded.data === undefined ||
                response.data.decoded.data.payload === undefined
            ){
                return res.status(401).send('Authentication Middleware 89: A valid client_token is required').end();
            }
            let client_token = response.data.decoded.data.payload.client_token;
            let client = null;
            /**
             * Got the token from the decoded key now. Get the client and check the params
             */
            try{
                client = await axios.get(`${global.servers.client}?client_token=${client_token}`);
                if(client !== null){
                    /**
                     * Need to add more parmeters here. We want to check the clinetIP with the key IP
                     * Check the request host with the database expected host
                     */
                    req.client = client.data;
                    req.headers['x-ip'] = requestIp.getClientIp(req);

                    delete client.data.hash
                    delete client.data.shash

                    req.headers['x-client'] = JSON.stringify(client.data);
            //        req.headers['x-client-key'] = null;
                    console.log('CLIENT VALIDATION WAS SUCCESSFUL.');
                    return next();
                }else{
                    console.log('A VALID CLIENT WAS NOT RETURNED')
                    return res.status(401).send('Authentication Middleware 101: A valid client_token is required').end();
                }
            }catch(error){
                console.log('CLIENT SERVER ERROR')
                return res.status(401).send('Authentication Middleware 104: A valid client_token is required').end();
            }            
        }).catch(err => {
            console.log(err)
            return res.status(401).send('Authentication Middleware 130: A valid client_token is required').end();
        })
    }
}