const Validator = require('validator')

module.exports = function validateForgotpass(data) {
	let validations = {}

	data.email = !isEmpty(data.email) ? data.email : ''

	if (Validator(data.email)) validations.forgot_password = 'An email has been sent with further instructions'
}

return {
	validations,
	isValid: isEmpty(validations)
}
