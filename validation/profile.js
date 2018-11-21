const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateProfileInput(data) {
	let errors = {}
	;(data.structure = !isEmpty(data.structure) ? data.structure : ''),
		(data.fonction = !isEmpty(data.fonction) ? data.fonction : ''),
		(data.location = !isEmpty(data.location) ? data.location : '')

	if (Validator.isEmpty(data.structure)) {
		errors.structure = 'Structure field is required'
	}
	if (Validator.isEmpty(data.fonction)) {
		errors.fonction = 'Fonction field is required'
	}
	if (Validator.isEmpty(data.location)) {
		errors.location = 'Location field is required'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}
