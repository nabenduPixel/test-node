const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    template_category: {
        type: String,
        enum: ['Booking', 'Customer', 'Service Provider', 'Admin', 'Global', 'Service'],
        default: 'Booking'
    },
    template_code: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    email_body: {
        type: String,
        required: false,
    },
    is_sms: {
        type: Boolean,
        default: true
    },
    sms_body: {
        type: String,
        required: false,
    },
    is_push: {
        type: Boolean,
        default: false,
    },

    push_body: {
        type: String,
        required: false,
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
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

schema.index({template_code:1})

module.exports = mongoose.model("EmailTemplate", schema, "ab_email_templates")