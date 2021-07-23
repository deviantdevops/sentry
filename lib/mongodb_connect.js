const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const CONFIG = require('../config');

mongoose.connect(
    `mongodb://${CONFIG.MONGO.USER}:${CONFIG.MONGO.PASSWORD}@${CONFIG.MONGO.HOST}/${CONFIG.MONGO.DATABASE}?authMechanism=${CONFIG.MONGO.AUTH_MECHANISM}`, CONFIG.MONGO.OPTIONS );
const DB = mongoose.connection;
DB.on('error', console.error.bind(console, 'connection error:'));
DB.once('open', function() {
    console.log(`${CONFIG.APP_NAME} has successfully connected to MongoDB`)
});

module.exports = DB;
