const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    created_at: { type: Date, default: Date.now, immutable: true },
    updated_at: { type: Date, default: Date.now },
    user_token: { type: String, unique: true },
    prefix: { type: String },
    first_name: { type: String},
    first_name_hash: { type: String},
    last_name: { type: String },
    last_name_hash: { type: String },
    email: { type: String, unique: true },
    email_hash: { type: String, unique: true },

    scopes: { type: Array },
    roles: { type: Array },

}, { collection : 'users' });



module.exports = mongoose.model('User', userSchema)