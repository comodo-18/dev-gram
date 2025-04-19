const  validator  = require('validator');

const validateSignUpDetails = (req) => {
    const { firstName, email, password } = req.body;
    const errors = [];

    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
        errors.push('Name is required and must not be empty.');
    }

    if( !email || typeof email !== 'string' || !validator.isEmail(email)) {
        errors.push('Email is required and must be a valid email address.');
    }
    if (!password || validator.isStrongPassword(password, { minLength: 6 }) === false) {
        errors.push('Password is required and must be at least 6 characters long.');
    }
    if (errors.length > 0) {
        throw new Error(errors.join(' '));
    }
}

module.exports = {
    validateSignUpDetails
}