const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const SeineSaintDenisReseauxSchema = new Schema({
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

module.exports = Reseaux_seinesaintdenis = mongoose.model('Reseaux_seinesaintdenis', SeineSaintDenisReseauxSchema)
