const mongoose = require("mongoose");

const userCode = mongoose.model(
    "UserCode",
    new mongoose.Schema({
        user_id: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
        ],
        code: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Registration','Profile','Contact','Forget','Payout','Provider Profile Authentication','Admin'],
            default: 'Registration'
        },
    },{timestamps:true}),"ab_user_codes"
);

module.exports = userCode;