const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ab_users',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true,
      transform(doc, ret) {
          ret.id = ret._id
          delete ret._id
      }
  },
  toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Token', tokenSchema, 'ab_access_tokens')
