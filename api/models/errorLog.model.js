const mongoose = require('mongoose');

const schema = mongoose.Schema({
    module: { type: String, default: null },
    message: { type: String, default: null },
    request: { type: String, default: null },
    stack: { type: String, default: null }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('ErrorLog', schema, 'ab_error_logs');