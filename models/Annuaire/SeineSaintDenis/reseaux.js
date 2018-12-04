const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const SeineSaintDenisReseauxSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	name: {
		type: String
	},
	rue: {
		type: String
	},
	postcode: {
		type: String
	},
	compl: {
		type: String
	},
	phone: {
		type: String
	},
	email: {
		type: String
	},
	web: {
		type: String
	},

	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Reseaux_seinesaintdenis = mongoose.model('Reseaux_seinesaintdenis', SeineSaintDenisReseauxSchema)
