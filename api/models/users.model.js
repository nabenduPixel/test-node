const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const UserDetail=require("./userDetails.model")

const userSchema = mongoose.Schema({
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ab_roles', default: '671a006cd736ff3adbbe4bed', index: { unique: false, name: "userRole" } },
  title: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  first_name: { type: String, index: { unique: false, name: "userFirstName" } },
  last_name: { type: String, index: { unique: false, name: "userLastName" } },
  email: { type: String, default:null },
  password: { type: String, index: { unique: false, name: "userPassword" } },
  iso: { type: String },
  mobile_code: { type: String },
  mobile_number: { type: String ,default:null},
  mobile_number_verified: { type: Boolean, default: true },
  remember_token: { type: String },
  registration_token: { type: String, index: { unique: false, name: "userRegistrationToken" } },
  forgot_token: { type: String, index: { unique: false, name: "userForgotToken" } },
  status: { type: String, enum: ['Active', 'Inactive', 'Expired', 'Verified', 'Blocked'], default: 'Inactive', index: { name: "userStatus" } },
  is_otp_needed: { type: Boolean, default: false },
  set_password_key: { type: String },
  valid_upto: { type: Number },
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

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.virtual('userDetails', {
  ref: UserDetail,
  localField: '_id',
  foreignField: 'user_id'
});

module.exports = mongoose.model('User', userSchema, 'ab_users')