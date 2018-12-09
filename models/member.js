const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const AdherentSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},

	member: {
		type: String
	},

	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = Adherent = mongoose.model('adherent', AdherentSchema)
