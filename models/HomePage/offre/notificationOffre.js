const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const OffreSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},

	titre: {
		type: String
	},
	lieu: {
		type: String
	},
	company: {
		type: String
	},
	poste: {
		type: String
	},
	when: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
})
module.exports = Offre = mongoose.model('Offre', OffreSchema)
