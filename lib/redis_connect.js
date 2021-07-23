
const PARAMS = {
    host: global.config.REDIS.HOST,
    port: global.config.REDIS.PORT,
    password: global.config.REDIS.PASSWORD,
    family:"IPv4",
    db:"0",
    no_ready_check:true,
    socket_keepalive:true
};

var REDIS = require("redis");
var PUBLISHER = REDIS.createClient(PARAMS);
PUBLISHER.on("connect", function() {
    console.log(`${global.config.APP_NAME} is now connected to REDIS`);
});

module.exports = PUBLISHER;