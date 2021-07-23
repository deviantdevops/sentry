const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    user_token: { type: String },
    roles: {type: Array},
    id: { type: String, unique: true },
    secret: { type: String },
    name: { type: String },
    callback: { type: String },
}, { collection : 'clients' });

module.exports = mongoose.model('Client', clientSchema)
