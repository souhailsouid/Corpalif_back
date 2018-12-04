const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateAnnuaireInput(data) {
	let errors = {}
	;(data.name = !isEmpty(data.name) ? data.name : ''), (data.adresse = !isEmpty(data.adresse) ? data.adresse : '')

	return {
		errors,
		isValid: isEmpty(errors)
	}
}
