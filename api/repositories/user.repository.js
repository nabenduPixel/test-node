const User = require('../models/users.model');
const UserDetail = require('../models/userDetails.model');
const Token = require('../models/token.model');

class userRepository {

    async getUserByEmailPassword({ email, password }) {
        try {
            let user = await User.findOne({ email: email });
            if (!user || !(await user.isPasswordMatch(password))) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    }


    async getUserDetailByUserId(payload) {
        try {
            let data = await UserDetail.findOne({ user_id: payload }).populate({ path: 'currency_id', model: "Currency" });
            if (!data) {
                return null;
            }
            return data;
        } catch (e) {
            throw e;
        }
    }

    async checkEmailExists(payload) {
        const user = await User.findOne({ email: payload.email });
        if (user) {
            return user;
        }else{
            return false;
        }
    }

    async checkMobileExists(payload) {
        const user = await User.findOne({ mobile_number: payload.mobile_number });
        if (user) {
            return user;
        }else{
            return false;
        }
    }

    async getUserDetailByUserCode(payload) {
        try {
            let data = await UserDetail.findOne({ user_code: payload });
            if (!data) {
                return null;
            }
            return data;
        } catch (e) {
            throw e;
        }
    }

    async saveRegistrationData(payload){
        const user = new User({ ...payload, mobile_code: payload.dial_code });
        await user.save();
        return { user };
    }

    async userCheckEmail(payload) {
        const user = await User.findOne({
            email: payload.email,
            role_id: { $ne: mongoose.Types.ObjectId('665d529d6caaa43c454087dc') }
        }).select('id first_name last_name email mobile_number mobile_code mobile_number_verified');
        if (user) {
            return user;
        } else {
            return false;
        }
    }

    async saveToken(payload) {
        try {
            let data = await Token.create({ user: payload.user.id, token: payload.token });
            if (!data) {
                return null;
            }
            return data;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = new userRepository();