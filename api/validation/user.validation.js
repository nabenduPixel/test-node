const validator = require('validator');

exports.validateUserRequest = (body) => {
    if (!body.title) return 'Title is required'
    if (!body.dial_code) return 'Dial code is required'
    if (!body.iso) return 'ISO code is required'
    if (!body.mobile_number) return 'Mobile number is required'
    if (!body.first_name) return 'First name is required'
    if (!body.last_name) return 'Last name is required'
    if (!body.email) return 'Email is required'
    if (!validator.isEmail(body.email)) return 'Please enter a valid email address'
    if (!body.password) return 'Password is required'
};

exports.loginSchema = (body) => {
    if (!body.email) return 'Email id is required'
    if (!validator.isEmail(body.email)) return 'Please enter a valid email address.'
    if (!body.password) return 'Password is required'
};