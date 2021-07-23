/**
 * For a request to be properly relayed, you must list new servers here
 * else the request does not know where to go. When sending to Sentry, lets use this example:
 * Lets say you want a requrest to go to your cart application located at http://localhost:9025/item.
 * If you were to communicate directly with Cart, then you would talk to that address. But as Sentry stands
 * between you and the cart API, you must tell sentry where to proxy your request to. You would instead
 * send your request to http://localhost:7006/cart/item where "/cart" corresponds to the key value pair below and port 7006
 * is this application.
 * THe proxy will remove that "cart" string from the request and then come here to look for the real location
 * of Cart and then send the rest of the request forward. The finaly request will be http://localhost:9025/item
 */

 const settings = {
            'development': {
                'crypt':    'http://localhost:7001',
                'auth':     'http://localhost:7002',
                'user':     'http://localhost:7003',
                'client':   'http://localhost:7004',
                'roles':    'http://localhost:7005',

                'order':'http://localhost:9027',
                'cart': 'http://localhost:9025',
                'key': 'http://localhost:9065',
                'tax': 'http://localhost:9019',
                'payment': 'http://localhost:9031',
                'alerts': 'http://localhost:9021',
                'product': 'http://localhost:9026',

    
            },
            'staging': {
                
            },
            'production' : {
                
            }
            
}
                
const servers = () => {
    global.servers = settings[process.env.NODE_ENV];
}

module.exports = servers();