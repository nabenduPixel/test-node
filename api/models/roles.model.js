const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    role: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active', index: { unique: false, name: "roleStatus" } }
}, {
    timestamps: false,
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
})

module.exports = mongoose.model('Role', roleSchema, 'ab_roles')