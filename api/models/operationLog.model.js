const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    section: { type: String },
    message: { type: String },
    url: { type: String },
    request: { type: String },
    response: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

// schema.pre('save', function (next) {
//     if (this.isModified('request') && typeof this.request === 'object') {
//         this.request = JSON.stringify(this.request);
//     }
//     if (this.isModified('response') && typeof this.response === 'object') {
//         this.response = JSON.stringify(this.response);
//     }
//     next();
// });

module.exports = mongoose.model('OperationLog', schema, 'ab_operation_logs');