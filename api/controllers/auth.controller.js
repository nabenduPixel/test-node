const validateRequest = require('../validation/user.validation');
const userRepository = require('../repositories/user.repository');
const authHelper = require('../helpers/authHelper');
const customerValidate = require('../validation/customer.validation');
const emailHelpers = require('../helpers/email.helper');


const moduleName = "Auth Controller";

class AuthController {
    constructor() { }


    async registration(req, res) {
        try {
            const validationError = validateRequest.validateUserRequest(req.body);
            if (validationError) return res.error({ message: validationError });
            // email address validation
            if (await userRepository.checkEmailExists(req.body)) {
                return res.error({ message: 'This email address already exists' })
            }
            // mobile number validation
            if (await userRepository.checkMobileExists(req.body)) {
                return res.error({ message: 'This mobile number already exists' })
            }
            // code, token generation
            const uniqueCode = await authHelper.generateUniqueUserCode(8, 'ud');
            const generateLink = req.body.first_name + '-' + req.body.last_name + '-' + uniqueCode;
            const registration_token = authHelper.generateRegistrationToken(uniqueCode);
            // database operations
            const saveUser = await userRepository.saveRegistrationData({ ...req.body, registration_token, generateLink, uniqueCode });
            if (saveUser.error) return res.error({ message: saveUser.error });
            await authHelper.sendVerifyNotification({ ...req.body, registrationToken: registration_token, generateOTP: '', type: ['email'] })
            res.success({ message: 'You have successfully registered. A verification email has been sent to your registered email account' });
        } catch (error) {
            res.exception({ moduleName, error });
        }
    }

    async login(req, res) {
        const validationError = validateRequest.loginSchema(req.body);
        if (validationError) return res.error({ message: validationError });
        try {
            const user = await userRepository.getUserByEmailPassword(req.body);
            if (!user) return res.error({ message: 'Invalid Email / Password' });
            const accountStatus = authHelper.checkAccountStatus(user);
            if (accountStatus.error) return res.error({ message: accountStatus.error });
            const token = authHelper.generateToken(user);
            await userRepository.saveToken({ user, token });
            // const userData = await userRepository.getUserDetailByUserId(user._id)
            const responseData = authHelper.generateLoginResponse({ user: user.toObject(), token });
            // const responseData = authHelper.generateLoginResponse({ user: user.toObject(), userData, token });
            // const legacyLogin = await authHelper.legacyLogin({ request_data: req.request_data });
            return res.success({ data: { nodeLogin: responseData }, message: 'You have successfully login' });

        } catch (error) {
            res.exception({moduleName,error});
        }
        // return res.success({data:"ok login"});
    }

    async forgotPasswordByEmail(req, res) {
        const validationError = customerValidate.emailRequestValidate(req.body);
        if (validationError) return res.error({ message: validationError });
        try {
            const userEmail = await userRepository.userCheckEmail(req.body);
            if (!userEmail) {
                return res.error({ message: 'Email id not registered.' });
            } else {
                const { id: userId, first_name: firstName, last_name: lastName, email, mobile_number_verified, mobile_code, mobile_number } = userEmail;
                const forgotToken = authHelper.generateToken(userId);
                const resultUser = await User.updateOne({ _id: userId }, { forgot_token: forgotToken, updated_by: userId });
                if (!resultUser) {
                    return res.error({ message: 'Something unexpected happened. Try again later.' });
                }
                const verificationLink = `${process.env.FRONTEND_URL}reset-password/${forgotToken}`;
                const link = `<a style="color: #008CBA" href="${verificationLink}">Reset Password</a>`;
                const EMAIL_SIGNATURE = 'support@altabooking.com';
                const searchArr = ['[FULLNAME]', '[RESETPASSWORDLINK]', '[SIGNATURE]'];
                const replaceArr = [`${firstName} ${lastName}`, link, EMAIL_SIGNATURE];
                const emailData = await emailHelpers.emailTemplate('Template 49', searchArr, replaceArr);
                if (emailData) {
                    const subject = emailData.subject || '';
                    await emailHelpers.sendEmailNotification(emailData, email, firstName, subject);
                    if (mobile_number_verified && mobile_code && mobile_number) {
                        const contactNumber = `${mobile_code}${mobile_number}`;
                        // await smsHelpers.sendMessageNotification('+' + contactNumber, [], [], emailData.sms);
                    }
                    return res.success({ data: 'Reset password link has been sent to your registered email.' });
                }
            }
        } catch (error) {
            console.log(error);
            return res.exception(error);
        }
    }

    async verifyResetPassword(req, res) {
        const validationError = emailRequest.tokenRequestValidate(req.body);
        if (validationError) return res.error({ message: validationError });
        const requestData = req.body;
        const forgotToken = requestData.forgot_token ? requestData.forgot_token.trim() : '';
        try {
            const userCheck = await User.findOne({ forgot_token: forgotToken }, 'id').exec();
            if (!userCheck) {
                return res.error({ message: 'Invalid operation.' });
            }
            const userId = userCheck.id || null;
            if (userId) {
                return res.success({
                    data: { user_id: userId }
                });
            } else {
                return res.error({ message: 'Invalid user.' });
            }
        } catch (error) {
            return res.exception(error);
        }

    }

    async resetPasswordWeb(req, res) {
        const validationError = emailRequest.verifyPasswordResetRequest(req.body);
        if (validationError) return res.error({ message: validationError });

        try {
            const { forgot_token, password } = req.body;
            const userCheck = await User.findOne({ forgot_token }).select('id role_id first_name last_name email mobile_code mobile_number mobile_number_verified');
            if (!userCheck) {
                return res.error({ message: 'Invalid user.' });
            }
            const userId = userCheck._id;
            const { first_name, last_name, email, role_id } = userCheck;
            userCheck.password = password;
            userCheck.forgot_token = '';
            userCheck.updated_at = new Date();
            userCheck.updated_by = userId;
            await userCheck.save();
            const EMAIL_SIGNATURE = 'support@altabooking.com';
            const searchArr = ['[FULLNAME]', '[SIGNATURE]'];
            const replaceArr = [`${first_name} ${last_name}`, EMAIL_SIGNATURE];
            const emailData = await emailHelpers.emailTemplate('Template 3', searchArr, replaceArr);
            if (emailData) {
                const toEmail = email;
                const toName = first_name;
                const subject = emailData.subject || '';
                const smsMessage = emailData.sms || '';
                const isSms = emailData.isSms || '';
                const pushBody = emailData.pushBody || '';
                const isPush = emailData.isPush || '';
                await emailHelpers.sendEmailNotification(emailData, toEmail, toName, subject);
                // const receivedAs = role_id === mongoose.Types.ObjectId('665d529d6caaa43c454087df') ? 'Service Provider' : 'Customer';
                // if (pushBody && isPush) {
                //     const notificationInformation = {};
                //     await sendPushNotification(userId, 'Global', receivedAs, notificationInformation, [], [], pushBody);
                // }
            }
            return res.success({ data: 'Password has been changed successfully.' });
        } catch (error) {
            return res.exception(error);
        }


    }

}

module.exports = new AuthController();