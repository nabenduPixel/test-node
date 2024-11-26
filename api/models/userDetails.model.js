const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ab_users' },
    birthday: { type: Date, required: false },
    person_type: {
        type: String,
        enum: ['BUSINESS', 'ORGANIZATION', 'SOLETRADER', 'NONE'],
        default: 'NONE'
    },
    nationality_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    company_vat_number: { type: String, required: false, },
    company_name: { type: String, required: false, },
    address: { type: String, required: false, },
    account_origin: { type: String, enum: ['Facebook', 'Google', 'Linkedin', 'Self', 'Admin'], default: 'Self' },
    country_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    state_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    city: { type: String, required: false, },
    post_code: { type: String, required: false, },
    store_details: { type: String, required: false, },
    user_link: { type: String, required: false, },
    website: { type: String, required: false, },
    instagram_link: { type: String, required: false, },
    facebook_link: { type: String, required: false, },
    user_code: { type: String, required: true, },
    currency_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ab_currencies', default: '66582a178a4ad6a19003e26b' },
    parent_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    updated_by: { type: mongoose.Schema.Types.ObjectId, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, default: null },
    profile_image: { type: String, required: false, },
    description: { type: String, required: false, },
    updated_at:{type:String}
}, {
    toJSON: {
        getters: true,
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    },
    toObject: { virtuals: true }
});

UserDetailsSchema.index({user_id:1})

module.exports = mongoose.model('UserDetail', UserDetailsSchema, 'ab_user_details');