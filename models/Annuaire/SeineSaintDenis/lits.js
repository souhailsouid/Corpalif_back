const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const SeineSaintDenisLitsSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	name: {
		type: String,
		required: true
	},
	adresse: {
		type: String,
		required: true
	},
	phone: {
		type: String
	},
	email: {
		type: String
	},
	responsable: {
		type: String
	},

	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Lits_seinesaintdenis = mongoose.model('lits_seinesaintdenis', SeineSaintDenisLitsSchema)
