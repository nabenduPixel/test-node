var validator = require('validator');

// exports.verifyGetProfileReq=(body)=>{
//     if(!body.user_id) return 'User id is required'
// }

exports.verifyUserMobileVerificationCode = (body) => {
    if (!body.dial_code) return 'Country code is required'
    if (!body.mobile_number) return 'Mobile number is required'
    if (body.mobile_number < 8 || body.mobile_number > 12) return 'Mobile number is not valid'
    if (!body.type) return 'Paramter is missing'
}

exports.verifyContactMobileNumber = (body) => {
    if (!body.code) return 'Verification code is required'
    if (!body.first_name) return 'First name is required'
    if (!body.last_name) return 'Last name is required'
    if (!body.dial_code) return 'Country code is required'
    if (!body.mobile_number) return 'Mobile number is required'
    if (body.mobile_number < 8 || body.mobile_number > 12) return 'Mobile number is not valid'
    if (!body.country_id) return 'Country is required'
    if (!body.state_id) return 'State is required'
    if (!body.city) return 'City is required'
    if (!body.post_code) return 'Zip code is required'
    if (!body.address) return 'Address is required'
    if (!body.email) return 'Email id is required'
    if (!validator.isEmail(body.email)) return 'Please enter a valid email address'
}

exports.saveContactRequest = (body) => {
    if (!body.first_name) return 'First name is required'
    if (!body.last_name) return 'Last name is required'
    if (!body.email) return 'Email id is required'
    if (!validator.isEmail(body.email)) return 'Please enter a valid email address'
    if (!body.mobile_code) return 'Country code is required'
    if (!body.mobile_number) return 'Mobile number is required'
    if (body.mobile_number < 8 || body.mobile_number > 12) return 'Mobile number is not valid'
    if (!body.country_id) return 'Country is required'
    if (!body.state_id) return 'State is required'
    if (!body.city) return 'City is required'
    if (!body.post_code) return 'Zip code is required'
    if (!body.address) return 'Address is required'
}

exports.verifyUpdateProfileReq = (body) => {
    if (!body.title) return 'Title is required'
    if (!body.first_name) return 'First name is required'
    if (!body.last_name) return 'Last name is required'
    if (!body.mobile_code) return 'Country code is required'
    if (!body.mobile_number) return 'Mobile number is required'
    if (body.mobile_number < 8 || body.mobile_number > 12) return 'Mobile number is not valid'
}

exports.verifyUpdateCurrency = (body) => {
    if (!body.currency_id) return 'Currency id is required'
}

exports.verifyContactDelete = (body) => {
    if (!body.address_id) return 'Address is not selected'
}

exports.verifyUserProfileMobileNumber = (body) => {
    if (!body.title) return 'Title is required'
    if (!body.first_name) return 'First name is required'
    if (!body.last_name) return 'Last name is required'
    if (!body.code) return 'Verification code is required'
    if (!body.mobile_code) return 'Country code is required'
    if (!body.mobile_number) return 'Mobile number is required'
    if (body.mobile_number < 8 || body.mobile_number > 12) return 'Mobile number is not valid'
}


exports.emailRequestValidate = (body) => {
    if (!body.email) return 'Email id is required'
    if (!validator.isEmail(body.email)) return 'Please enter a valid email address'
}
exports.tokenRequestValidate = (body) => {
    if (!body.forgot_token) return 'Parameter is missing.'
}

exports.verifyPasswordResetRequest = (body) => {
    if (!body.forgot_token) return 'Parameter is missing.'
    if (!body.password) return 'Password is required.'
}



