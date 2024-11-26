const mongoose = require('mongoose')


const categorySchema = mongoose.Schema({
  name: { type: String },
  parent_id: { type: String ,default:null },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive', index: { name: "categoryStatus" } },
  created_by: { type: mongoose.Schema.Types.ObjectId, default:null },
  updated_by: { type: mongoose.Schema.Types.ObjectId, default:null },
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


module.exports = mongoose.model('Category', categorySchema, 'ab_categories')