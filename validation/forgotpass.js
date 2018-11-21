const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateForgotpassinput(data) {
	let errors = {}

	data.email = !isEmpty(data.email) ? data.email : ''

	if (!Validator.isEmail(data.email)) {
		errors.forgot_password = 'Email is invalid'
	}

	if (Validator.isEmpty(data.email)) {
		errors.forgot_password = 'Email field is required'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}
