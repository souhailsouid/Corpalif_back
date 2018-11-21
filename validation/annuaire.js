const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateAnnuaireInput(data) {
	let errors = {}
	;(data.name = !isEmpty(data.name) ? data.name : ''), (data.adresse = !isEmpty(data.adresse) ? data.adresse : '')

	if (Validator.isEmpty(data.name)) {
		errors.AnnuaireName = 'Name field is required'
	}
	if (Validator.isEmpty(data.adresse)) {
		errors.AnnuaireAdresse = 'Adresse field is required'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}
