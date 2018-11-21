const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ValdOiseHadSchema = new Schema({
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

module.exports = Had_valdoise = mongoose.model('had_valdoise', ValdOiseHadSchema)
