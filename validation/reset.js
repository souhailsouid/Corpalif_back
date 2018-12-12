const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateResetpassinput(data) {
	let validations = {}
	data.password = !isEmpty(data.password) ? data.password : ''
	data.password2 = !isEmpty(data.password2) ? data.password2 : ''

	if (Validator.equals(data.password, data.password2) && Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Your password has been changed !'
	}
	return {
		validations,
		isValid: !isEmpty(validations)
	}
}
