const userRepository = require('../repositories/user.repository');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const EmailHelpers = require('./email.helper');

exports.generateUniqueUserCode = async (length, available_sets) => {
    const code = this.generateCode(length, available_sets);
    const data = await userRepository.getUserDetailByUserCode(code);
    if (data) {
        this.generateUniqueUserCode(length, available_sets);
    } else {
        return code;
    }
}

exports.generateLoginResponse = (payload) => {
    payload.user.id = payload.user._id;
    delete payload.user._id;
    return responseData = {
        profile: {
            ...payload.user,
            token: payload.token,
            token_type: 'Bearer',
            profile_image: '',
        },
        // currency_info: {
        //     currency_id: payload.userData.currency_id.id,
        //     currency_code: payload.userData.currency_id.code,
        //     currency_symbol: payload.userData.currency_id.symbol
        // },
        priority_list: {}
    };
}


exports.checkAccountStatus = (user) => {
    if (user.status == 'Expired') {
        return { error: 'Your account has expired, please contact Admin at info@altabooking.com' }
    }
    if (user.status == 'Blocked') {
        return { error: 'Your account has blocked, please contact Admin at info@altabooking.com' }
    }
    if (user.status == 'Inactive') {
        return { error: 'Email is not verified' }
    }
    if (!user.mobile_number_verified) {
        return { error: 'Phone number is not verified' }
    }
    return {}
}

exports.generateCode = (length, available_sets = 'luds') => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '~`!@#$%^&*(){}\[\];:"\'<,.>?\/\\|_+=-';
    let newString = '';
    let matches = '';

    if (available_sets.includes('l')) matches += lower
    if (available_sets.includes('u')) matches += upper
    if (available_sets.includes('d')) matches += digits
    if (available_sets.includes('s')) matches += special

    for (let i = 0; i < length; i++) {
        newString += matches.charAt(Math.floor(Math.random() * matches.length))
    }
    return newString;
}


exports.generateToken = (user) => {
    const payload = {
        id: user._id,
    };
    const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: "30d",
    });
    return token;
}

exports.generateRegistrationToken = (payload) => {
    return md5(`${payload}`)
}


exports.sendVerifyNotification = async (payload) => {
    const verificationLink = `${process.env.FRONTEND_URL}customer/account-verification/${payload.registrationToken}`;
    const link = "<a href='" + verificationLink + "'>Verify Account</a>";
    const searchArr = ['[FULLNAME]', '[NAME]', '[EMAIL]', '[LINK]', '[VERIFICATIONCODE]', '[SIGNATURE]'];
    const replaceArr = [`${payload.first_name} ${payload.last_name}`, payload.first_name, payload.email, link, payload.generateOTP, process.env.MAIL_FROM_ADDRESS];
    const emailData = await EmailHelpers.emailTemplate("Template 8", searchArr, replaceArr);
    if (payload.type.includes('email') && emailData && payload.registrationToken.length) {
        let toEmail = payload.email;
        let toName = payload.first_name;
        let subject = emailData.subject || '';
        await EmailHelpers.sendEmailNotification(emailData, toEmail, toName, subject);
    }
    if (payload.type.includes('email') && emailData && !payload.registrationToken.length) {
        let toEmail = payload.email;
        let toName = payload.first_name;
        let subject = emailData.subject || '';
        const searchArr = ['[VERIFICATIONCODE]'];
        const replaceArr = [payload.generateOTP];
        searchArr.map((n, i) => {
            emailData.sms = emailData.sms.replace(n, replaceArr[i]);
        })
        emailData.body = emailData.sms || '';
        await EmailHelpers.sendEmailNotification(emailData, toEmail, toName, subject);
    }
}